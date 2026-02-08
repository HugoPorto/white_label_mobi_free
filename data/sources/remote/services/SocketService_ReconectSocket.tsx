import { Socket } from "socket.io-client";
import io from 'socket.io-client';
import { BASE_URL } from "../api/ApiRequestHandler";
import { LocalStorage } from "../../local/LocalStorage";

export class SocketService {

    private locationSocket: Socket | null = null;
    private paymentSocket: Socket | null = null;
    private jwtToken: string | null = null;
    private refreshToken: string | null = null;
    private sessionId: string | null = null;
    private isRefreshing: boolean = false;
    private authFailedCallback: ((error: any) => void) | null = null;

    constructor() {
        // Não inicializa sockets automaticamente
        this.loadToken();
    }

    // Carrega o token JWT do AsyncStorage
    private async loadToken() {
        try {
            const localStorage = new LocalStorage();
            const authData = await localStorage.getItem('auth');
            console.log('📦[SOCKET_SERVICE] AuthData carregado do LocalStorage:', authData);
            if (authData) {
                const parsedAuth = JSON.parse(authData);
                this.jwtToken = parsedAuth.token;
                this.refreshToken = parsedAuth.refresh_token;
                this.sessionId = parsedAuth.session_id;
                console.log('🔑[SOCKET_SERVICE] Token JWT carregado');
                console.log('🔑[SOCKET_SERVICE] Refresh Token presente?', !!this.refreshToken);
                console.log('🔑[SOCKET_SERVICE] Session ID:', this.sessionId);
            } else {
                console.warn('⚠️[SOCKET_SERVICE] Nenhum authData encontrado no AsyncStorage');
            }
        } catch (error) {
            console.error('❌[SOCKET_SERVICE] Erro ao carregar token JWT:', error);
        }
    }

    // Atualiza o token JWT (chamado após login ou refresh)
    async setToken(token: string, refreshToken?: string, sessionId?: string) {
        this.jwtToken = token;
        if (refreshToken) this.refreshToken = refreshToken;
        if (sessionId) this.sessionId = sessionId;
        console.log('🔑 Token JWT atualizado no SocketService');
        
        // Atualiza no AsyncStorage
        try {
            const localStorage = new LocalStorage();
            const authData = await localStorage.getItem('auth');
            if (authData) {
                const parsedAuth = JSON.parse(authData);
                parsedAuth.token = token;
                if (refreshToken) parsedAuth.refresh_token = refreshToken;
                if (sessionId) parsedAuth.session_id = sessionId;
                await localStorage.save('auth', JSON.stringify(parsedAuth));
            }
        } catch (error) {
            console.error('❌ Erro ao salvar token atualizado:', error);
        }
        
        // Reconecta sockets ativos para aplicar o novo token
        const wasLocationConnected = this.isLocationConnected();
        const wasPaymentConnected = this.isPaymentConnected();
        
        if (wasLocationConnected) {
            console.log('🔄 Reconectando Location Socket com novo token...');
            this.disconnectLocationSocket();
            await this.initLocationSocket();
        }
        
        if (wasPaymentConnected) {
            console.log('🔄 Reconectando Payment Socket com novo token...');
            this.disconnectPaymentSocket();
            await this.initPaymentSocket();
        }
    }

    // Renova o token usando refresh_token
    private async refreshTokenIfNeeded(): Promise<boolean> {
        if (this.isRefreshing) {
            console.log('⏳[SOCKET_SERVICE] Refresh já em andamento...');
            return false;
        }

        if (!this.refreshToken) {
            console.error('❌[SOCKET_SERVICE] Refresh token não disponível');
            return false;
        }

        this.isRefreshing = true;
        console.log('🔄[SOCKET_SERVICE] Renovando token expirado...');

        try {
            const response = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: this.refreshToken
                })
            });

            if (!response.ok) {
                console.error('❌[SOCKET_SERVICE] Erro ao renovar token. Status:', response.status);
                const errorText = await response.text();
                console.error('❌[SOCKET_SERVICE] Resposta:', errorText);
                return false;
            }

            const data = await response.json();
            console.log('✅[SOCKET_SERVICE] Token renovado com sucesso');

            // Atualiza os tokens
            await this.setToken(
                data.token,
                data.refresh_token,
                data.session_id
            );

            return true;
        } catch (error) {
            console.error('❌[SOCKET_SERVICE] Erro na renovação do token:', error);
            return false;
        } finally {
            this.isRefreshing = false;
        }
    }

    // === MÉTODOS PARA LOCATION SOCKET ===
    
    async initLocationSocket() {
        // Garante que o token está carregado
        if (!this.jwtToken) {
            await this.loadToken();
        }

        if (!this.jwtToken) {
            console.error('❌[SOCKET_SERVICE] Token JWT não encontrado. Faça login primeiro.');
            return;
        }

        // Remove "Bearer " do token se existir (socket.io espera apenas o token)
        const cleanToken = this.jwtToken.replace('Bearer ', '').trim();
        console.log('🚗[SOCKET_SERVICE] Inicializando Location Socket');
        console.log('🔑[SOCKET_SERVICE] Token length:', cleanToken.length);
        console.log('🔑[SOCKET_SERVICE] Token preview:', cleanToken.substring(0, 20) + '...');

        if (!this.locationSocket || !this.locationSocket.connected) {
            this.locationSocket = io(BASE_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                auth: {
                    token: cleanToken
                },
                extraHeaders: {
                    Authorization: this.jwtToken  // Aqui mantém com Bearer
                }
            });
            
            // Adiciona listeners para debug
            this.locationSocket.on('connect', () => {
                console.log('✅ Location Socket conectado com sucesso (autenticado)');
            });
            
            this.locationSocket.on('disconnect', (reason) => {
                console.log('❌ Location Socket desconectado:', reason);
            });
            
            this.locationSocket.on('connect_error', async (error) => {
                console.log('🚨[SOCKET_SERVICE] Erro de conexão Location Socket:', error.message);
                
                // Verifica se é realmente um erro de token/autenticação
                if (error.message.includes('Token') || error.message.includes('jwt') || error.message.includes('expired') || error.message.includes('unauthorized')) {
                    console.log('⚠️[SOCKET_SERVICE] Token expirado ou inválido. Tentando renovar...');
                    const renewed = await this.refreshTokenIfNeeded();
                    if (!renewed) {
                        console.error('❌[SOCKET_SERVICE] Não foi possível renovar o token.');
                        // Só notifica se o callback foi registrado E se o refresh falhou
                        if (this.authFailedCallback) {
                            console.log('🚨[SOCKET_SERVICE] Chamando callback auth_failed');
                            this.authFailedCallback({ reason: 'Token expirado e não foi possível renovar' });
                        } else {
                            console.log('⚠️[SOCKET_SERVICE] Callback auth_failed não registrado ainda');
                        }
                    } else {
                        console.log('✅[SOCKET_SERVICE] Token renovado com sucesso, socket reconectando...');
                    }
                } else {
                    console.log('ℹ️[SOCKET_SERVICE] Erro de conexão não relacionado a autenticação:', error.message);
                }
            });

            // Listener para erro de autenticação direto do servidor
            this.locationSocket.on('unauthorized', async (error) => {
                console.log('🚨[SOCKET_SERVICE] Location Socket - Unauthorized:', error);
                const renewed = await this.refreshTokenIfNeeded();
                if (!renewed) {
                    // Notifica a aplicação através do callback
                    if (this.authFailedCallback) {
                        console.log('🚨[SOCKET_SERVICE] Chamando callback auth_failed (unauthorized)');
                        this.authFailedCallback({ reason: 'Sessão expirada' });
                    }
                }
            });
        } else {
            console.log('🔄 Location Socket já está conectado');
        }
    }

    getLocationSocket(): Socket | null {
        return this.locationSocket;
    }

    sendLocationMessage(event: string, message: any) {
        if (this.locationSocket && this.locationSocket.connected) {
            console.log(`📡 Enviando mensagem via Location Socket - Evento: ${event}`, message);
            this.locationSocket.emit(event, message);
        } else {
            console.log('⚠️ Location Socket não está conectado');
        }
    }

    onLocationMessage(event: string, callback: (...args: any[]) => void) {
        if (this.locationSocket) {
            console.log(`👂[SOCKET_SERVICE] Location Socket escutando evento: ${event}`);
            console.log(`👂[SOCKET_SERVICE] Location Socket conectado?: ${this.locationSocket.connected}`);
            console.log(`👂[SOCKET_SERVICE] Location Socket ID: ${this.locationSocket.id}`);
            this.locationSocket.off(event);
            this.locationSocket.on(event, callback);
            console.log(`✅[SOCKET_SERVICE] Listener registrado para: ${event}`);
        } else {
            console.log(`❌[SOCKET_SERVICE] Location Socket não está inicializado!`);
        }
    }

    disconnectLocationSocket() {
        if (this.locationSocket) {
            console.log('🔌 Desconectando Location Socket 3');
            this.locationSocket.removeAllListeners();
            this.locationSocket.disconnect();
            this.locationSocket = null;
        }
    }

    // === MÉTODOS PARA PAYMENT SOCKET ===
    
    async initPaymentSocket() {
        // Garante que o token está carregado
        if (!this.jwtToken) {
            await this.loadToken();
        }

        if (!this.jwtToken) {
            console.error('❌[SOCKET_SERVICE] Token JWT não encontrado. Faça login primeiro.');
            return;
        }

        // Remove "Bearer " do token se existir (socket.io espera apenas o token)
        const cleanToken = this.jwtToken.replace('Bearer ', '').trim();
        console.log('💳[SOCKET_SERVICE] Inicializando Payment Socket');
        console.log('🔑[SOCKET_SERVICE] Token length:', cleanToken.length);

        if (!this.paymentSocket || !this.paymentSocket.connected) {
            this.paymentSocket = io(BASE_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                auth: {
                    token: cleanToken
                },
                extraHeaders: {
                    Authorization: this.jwtToken  // Aqui mantém com Bearer
                }
            });

            // Adiciona listeners para debug
            this.paymentSocket.on('connect', () => {
                console.log('✅ Payment Socket conectado com sucesso (autenticado)');
            });
            
            this.paymentSocket.on('disconnect', (reason) => {
                console.log('❌ Payment Socket desconectado:', reason);
            });
            
            this.paymentSocket.on('connect_error', async (error) => {
                console.log('🚨 Erro de conexão Payment Socket:', error.message);
                if (error.message.includes('Token') || error.message.includes('jwt') || error.message.includes('expired')) {
                    console.log('⚠️ Token expirado. Tentando renovar...');
                    const renewed = await this.refreshTokenIfNeeded();
                    if (!renewed) {
                        console.error('❌ Não foi possível renovar o token. Usuário precisa fazer login novamente.');
                        // Notifica a aplicação através do callback
                        if (this.authFailedCallback) {
                            this.authFailedCallback({ reason: 'Token expirado e não foi possível renovar' });
                        }
                    }
                }
            });

            // Listener para erro de autenticação direto do servidor
            this.paymentSocket.on('unauthorized', async (error) => {
                console.log('🚨 Não autorizado:', error);
                const renewed = await this.refreshTokenIfNeeded();
                if (!renewed) {
                    // Notifica a aplicação através do callback
                    if (this.authFailedCallback) {
                        this.authFailedCallback({ reason: 'Sessão expirada' });
                    }
                }
            });
        } else {
            console.log('🔄 Payment Socket já está conectado');
        }
    }

    getPaymentSocket(): Socket | null {
        return this.paymentSocket;
    }

    sendPaymentMessage(event: string, message: any) {
        if (this.paymentSocket && this.paymentSocket.connected) {
            console.log(`📡 Enviando mensagem via Payment Socket - Evento: ${event}`, message);
            this.paymentSocket.emit(event, message);
        } else {
            console.log('⚠️ Payment Socket não está conectado');
        }
    }

    onPaymentMessage(event: string, callback: (...args: any[]) => void) {
        if (this.paymentSocket) {
            console.log(`👂 Payment Socket escutando evento: ${event}`);
            this.paymentSocket.off(event);
            this.paymentSocket.on(event, callback);
        }
    }

    disconnectPaymentSocket() {
        if (this.paymentSocket) {
            console.log('🔌 Desconectando Payment Socket');
            this.paymentSocket.removeAllListeners();
            this.paymentSocket.disconnect();
            this.paymentSocket = null;
        }
    }

    // Registra callback para falha de autenticação
    onAuthFailed(callback: (error: any) => void) {
        console.log('✅[SOCKET_SERVICE] Registrando callback auth_failed');
        this.authFailedCallback = callback;
    }

    // Remove callback de falha de autenticação
    offAuthFailed() {
        this.authFailedCallback = null;
        console.log('🔌 Callback auth_failed removido');
    }

    // === MÉTODOS PARA COMPATIBILIDADE (DEPRECATED) ===
    
    getSocket() {
        // Retorna o locationSocket para compatibilidade
        console.warn('⚠️ getSocket() está deprecated. Use getLocationSocket() ou getPaymentSocket()');
        return this.locationSocket;
    }

    sendMessage(event: string, message: any) {
        // Para compatibilidade, usa location socket
        console.warn('⚠️ sendMessage() está deprecated. Use sendLocationMessage() ou sendPaymentMessage()');
        this.sendLocationMessage(event, message);
    }

    onMessage(event: string, callback: (...args: any[]) => void) {
        // Para compatibilidade, usa payment socket (para PPS)
        console.warn('⚠️ onMessage() está deprecated. Use onLocationMessage() ou onPaymentMessage()');
        this.onPaymentMessage(event, callback);
    }

    disconnect() {
        console.log('Desconectando todos os sockets');
        this.disconnectLocationSocket();
        this.disconnectPaymentSocket();
    }

    // === MÉTODOS DE STATUS ===
    
    isLocationConnected(): boolean {
        return this.locationSocket?.connected || false;
    }

    isPaymentConnected(): boolean {
        return this.paymentSocket?.connected || false;
    }

    // Método para aguardar conexão do Location Socket
    async waitForLocationConnection(timeout = 5000): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.isLocationConnected()) {
                resolve(true);
                return;
            }
            
            const timer = setTimeout(() => {
                resolve(false);
            }, timeout);
            
            if (this.locationSocket) {
                this.locationSocket.once('connect', () => {
                    clearTimeout(timer);
                    resolve(true);
                });
            } else {
                clearTimeout(timer);
                resolve(false);
            }
        });
    }
}