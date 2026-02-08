import { Socket } from "socket.io-client";
import io from 'socket.io-client';
import { BASE_URL } from "../api/ApiRequestHandler";
import { LocalStorage } from "../../local/LocalStorage";
import { EventEmitter } from 'eventemitter3';

export class SocketService extends EventEmitter {

    private locationSocket: Socket | null = null;
    private paymentSocket: Socket | null = null;
    private jwtToken: string | null = null;
    private tokenExpiryTimer: NodeJS.Timeout | null = null;

    constructor() {
        super();
        this.loadToken();
    }

    // ====================================================================
    // ==== Atualiza o token JWT (chamado após login ou refresh) ==========
    // ====================================================================
    async setToken(token: string) {
        this.jwtToken = token;
        console.log('================================================');
        console.log('File: SocketService.tsx, Method: setToken');
        console.log('🔑 Token JWT atualizado no SocketService');
        console.log('================================================');

        // Agendar renovação preventiva
        this.scheduleTokenRefresh(token);

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

    // ========================================================================
    // ==== Carrega o token JWT do LocalStorage para uso nos sockets ==========
    // ========================================================================
    private async loadToken() {
        try {
            const localStorage = new LocalStorage();
            const authData = await localStorage.getItem('auth');
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: loadToken');
            console.log('AuthData carregado do LocalStorage:', authData);
            console.log('================================================');
            if (authData) {
                const parsedAuth = JSON.parse(authData);
                this.jwtToken = parsedAuth.token;
                console.log('================================================');
                console.log('File: SocketService.tsx, Method: loadToken');
                console.log('🔑 Token JWT carregado para SocketService');
                console.log('================================================');
            }
        } catch (error) {
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: loadToken');
            console.log('❌ Erro ao carregar token JWT:', error);
            console.error('❌ Erro ao carregar token JWT:', error);
            console.log('================================================');
        }
    }

    // ==========================================================
    // ==== Calcular tempo até expiração e agendar renovação ====
    // ==========================================================
    private scheduleTokenRefresh(token: string) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica payload do JWT
        const expiryTime = payload.exp * 1000; // Converter para ms
        const now = Date.now();

        const refreshTime = expiryTime - now - (5 * 60 * 1000); // Renovar 5 minutos antes de expirar

        if (refreshTime > 0) { // Se ainda não expirou
            this.tokenExpiryTimer = setTimeout(() => {
                this.emit('token_needs_refresh');
            }, refreshTime);
        }
    }

    // ========================================================================================
    // ================== Faz a inicialização do socket com autenticação JWT ==================
    // ========================================================================================
    async initLocationSocket() {
        if (!this.jwtToken) { // Garante que o token está carregado
            await this.loadToken();
        }

        if (!this.jwtToken) { // Se ainda não tiver token, não conecta
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: initLocationSocket');
            console.log('❌ Token JWT não encontrado. Faça login primeiro.');
            console.error('❌ Token JWT não encontrado. Faça login primeiro.');
            console.log('================================================');

            return;
        }

        if (!this.locationSocket || !this.locationSocket.connected) {
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: initLocationSocket');
            console.log('🚗 Inicializando Location Socket com JWT');
            console.log('================================================');
            this.locationSocket = io(BASE_URL, {
                transports: ['websocket'], // Força uso de WebSocket
                reconnection: true, // habilita reconexão automática
                reconnectionAttempts: 5, // Tenta reconectar 5 vezes
                reconnectionDelay: 1000, // 1 segundo entre tentativas
                auth: {
                    token: this.jwtToken
                },
                extraHeaders: {
                    Authorization: this.jwtToken
                }
            });

            // =========================================
            // ===== Adiciona listeners para debug =====
            // =========================================
            this.locationSocket.on('connect', () => {
                console.log('================================================');
                console.log('File: SocketService.tsx, Method: initLocationSocket');
                console.log('✅ Location Socket conectado com sucesso (autenticado)');
                console.log('================================================');
            });

            this.locationSocket.on('disconnect', (reason) => {
                console.log('================================================');
                console.log('File: SocketService.tsx, Method: initLocationSocket');
                console.log('❌ Location Socket desconectado:', reason);
                console.log('================================================');
            });

            this.locationSocket.on('connect_error', (error) => {
                console.log('================================================');
                console.log('File: SocketService.tsx, Method: initLocationSocket');
                console.log('🚨 Erro de conexão Location Socket:', error.message);
                console.log('================================================');
                if (error.message.includes('Token') ||
                    error.message.includes('jwt') ||
                    error.message.includes('unauthorized')) {
                    console.log('================================================');
                    console.log('File: SocketService.tsx, Method: initLocationSocket');
                    console.log('⚠️ Erro de autenticação JWT. Verifique seu token.');
                    console.log('================================================');
                    this.emit('token_expired');
                }
            });
        } else {
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: initLocationSocket');
            console.log('🔄 Location Socket já está conectado');
            console.log('================================================');
        }
    }

    // =============================================
    // ==== Obter instância do Location Socket =====
    // =============================================
    getLocationSocket(): Socket | null {
        return this.locationSocket;
    }

    // ==============================================
    // ==== Enviar mensagem via Location Socket =====
    // ==============================================
    sendLocationMessage(event: string, message: any) {
        if (this.locationSocket && this.locationSocket.connected) {
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: sendLocationMessage');
            console.log(`📡 Enviando mensagem via Location Socket - Evento: ${event}`, message);
            console.log('================================================');
            this.locationSocket.emit(event, message);
        } else {
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: sendLocationMessage');
            console.log('⚠️ Location Socket não está conectado');
            console.log('================================================');
        }
    }

    // =================================================
    // ==== Registrar listener via Location Socket =====
    // ========== Escuta eventos do servidor ===========
    // =================================================
    onLocationMessage(event: string, callback: (...args: any[]) => void) {
        if (this.locationSocket) {
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: onLocationMessage');
            console.log(`👂[SOCKET_SERVICE] Location Socket escutando evento: ${event}`);
            console.log(`👂[SOCKET_SERVICE] Location Socket conectado?: ${this.locationSocket.connected}`);
            console.log(`👂[SOCKET_SERVICE] Location Socket ID: ${this.locationSocket.id}`);
            console.log('================================================');
            this.locationSocket.off(event); // Remove listener anterior para evitar múltiplas chamadas
            this.locationSocket.on(event, callback); // Registra novo listener
        } else {
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: onLocationMessage');
            console.log(`❌[SOCKET_SERVICE] Location Socket não está inicializado!`);
            console.log('================================================');
        }
    }

    disconnectLocationSocket() {
        if (this.locationSocket) {
            console.log('================================================');
            console.log('File: SocketService.tsx, Method: disconnectLocationSocket');
            console.log('🔌 Desconectando Location Socket');
            console.log('================================================');
            this.locationSocket.removeAllListeners();
            this.locationSocket.disconnect();
            this.locationSocket = null;
        }
    }

    async initPaymentSocket() {
        if (!this.jwtToken) {
            await this.loadToken();
        }

        if (!this.jwtToken) {
            console.log('=================================================');
            console.log('File: SocketService.tsx, Method: initPaymentSocket');
            console.log('❌ Token JWT não encontrado. Faça login primeiro.');
            console.error('❌ Token JWT não encontrado. Faça login primeiro.');
            console.log('=================================================');

            return;
        }

        if (!this.paymentSocket || !this.paymentSocket.connected) {
            console.log('💳 Inicializando Payment Socket com JWT');
            this.paymentSocket = io(BASE_URL, {
                transports: ['websocket'], // Força uso de WebSocket
                reconnection: true, // habilita reconexão automática
                reconnectionAttempts: 5, // Tenta reconectar 5 vezes
                reconnectionDelay: 1000, // 1 segundo entre tentativas
                auth: {
                    token: this.jwtToken
                },
                extraHeaders: {
                    Authorization: this.jwtToken
                }
            });

            this.paymentSocket.on('connect', () => {
                console.log('✅ Payment Socket conectado com sucesso (autenticado)');
            });

            this.paymentSocket.on('disconnect', (reason) => {
                console.log('❌ Payment Socket desconectado:', reason);
            });

            this.paymentSocket.on('connect_error', (error) => {
                console.log('==================================================');
                console.log('File: SocketService.tsx, Method: initPaymentSocket');
                console.log('🚨 Erro de conexão Payment Socket:', error.message);
                console.log('==================================================');
                if (error.message.includes('Token') ||
                    error.message.includes('jwt') ||
                    error.message.includes('unauthorized')) {
                    console.log('==================================================');
                    console.log('File: SocketService.tsx, Method: initPaymentSocket');
                    console.log('⚠️ Erro de autenticação JWT. Verifique seu token.');
                    console.log('==================================================');
                    this.emit('token_expired');
                }
            });
        } else {
            console.log('💳==============================================');
            console.log('File: SocketService.tsx, Method: initPaymentSocket');
            console.log('🔄 Payment Socket já está conectado');
            console.log('💳==============================================');
        }
    }

    getPaymentSocket(): Socket | null {
        return this.paymentSocket;
    }

    sendPaymentMessage(event: string, message: any) {
        if (this.paymentSocket && this.paymentSocket.connected) {
            console.log('==================================================');
            console.log('File: SocketService.tsx, Method: sendPaymentMessage');
            console.log(`📡 Enviando mensagem via Payment Socket - Evento: ${event}`, message);
            console.log('==================================================');
            this.paymentSocket.emit(event, message);
        } else {
            console.log('==================================================');
            console.log('File: SocketService.tsx, Method: sendPaymentMessage');
            console.log('⚠️ Payment Socket não está conectado');
            console.log('==================================================');
        }
    }

    onPaymentMessage(event: string, callback: (...args: any[]) => void) {
        if (this.paymentSocket) {
            console.log('==================================================');
            console.log('File: SocketService.tsx, Method: onPaymentMessage');
            console.log(`👂 Payment Socket escutando evento: ${event}`);
            console.log('==================================================');
            this.paymentSocket.off(event);
            this.paymentSocket.on(event, callback);
        }
    }

    disconnectPaymentSocket() {
        if (this.paymentSocket) {
            console.log('==================================================');
            console.log('File: SocketService.tsx, Method: disconnectPaymentSocket');
            console.log('🔌 Desconectando Payment Socket');
            console.log('==================================================');
            this.paymentSocket.removeAllListeners();
            this.paymentSocket.disconnect();
            this.paymentSocket = null;
        }
    }

    // ================================================
    // ========== Verifica status de conexão ==========
    // ================================================
    isLocationConnected(): boolean {
        return this.locationSocket?.connected || false;
    }

    // ================================================
    // ========== Verifica status de conexão ==========
    // ================================================
    isPaymentConnected(): boolean {
        return this.paymentSocket?.connected || false;
    }

    // ==================================================
    // ======= Aguarda conexão do Location Socket =======
    // ==================================================
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

    // =========================================================
    // ============== Desconecta todos os sockets ==============
    // =========================================================
    disconnect() {
        console.log('================================================');
        console.log('File: SocketService.tsx, Method: disconnect');
        console.log('Desconectando todos os sockets');
        console.log('================================================');
        this.disconnectLocationSocket();
        this.disconnectPaymentSocket();
    }

    // ===========================
    // ===== COMPATIBILIDADE =====
    // ===========================
    getSocket() {
        return this.locationSocket;
    }

    // ===========================
    // ===== COMPATIBILIDADE =====
    // ===========================
    sendMessage(event: string, message: any) {
        this.sendLocationMessage(event, message);
    }

    // ===========================
    // ===== COMPATIBILIDADE =====
    // ===========================
    onMessage(event: string, callback: (...args: any[]) => void) {
        this.onPaymentMessage(event, callback);
    }
}