import { Socket } from "socket.io-client";
import io from 'socket.io-client';
import { BASE_URL } from "../api/ApiRequestHandler";
import { LocalStorage } from "../../local/LocalStorage";
import { EventEmitter } from 'eventemitter3';

export class SocketService extends EventEmitter {

    private locationSocket: Socket | null = null;
    private paymentSocket: Socket | null = null;
    private jwtToken: string | null = null;

    constructor() {
        super();
        // Não inicializa sockets automaticamente
        this.loadToken();
    }

    // Carrega o token JWT do AsyncStorage
    private async loadToken() {
        try {
            const localStorage = new LocalStorage();
            const authData = await localStorage.getItem('auth');
            console.log('AuthData carregado do LocalStorage:', authData);
            if (authData) {
                const parsedAuth = JSON.parse(authData);
                this.jwtToken = parsedAuth.token;
                console.log('🔑 Token JWT carregado para SocketService');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar token JWT:', error);
        }
    }

    // Atualiza o token JWT (chamado após login ou refresh)
    async setToken(token: string) {
        this.jwtToken = token;
        console.log('🔑 Token JWT atualizado no SocketService');
        
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

    // === MÉTODOS PARA LOCATION SOCKET ===
    
    async initLocationSocket() {
        // Garante que o token está carregado
        if (!this.jwtToken) {
            await this.loadToken();
        }

        if (!this.jwtToken) {
            console.error('❌ Token JWT não encontrado. Faça login primeiro.');
            return;
        }

        if (!this.locationSocket || !this.locationSocket.connected) {
            console.log('🚗 Inicializando Location Socket com JWT');
            this.locationSocket = io(BASE_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                auth: {
                    token: this.jwtToken
                },
                extraHeaders: {
                    Authorization: this.jwtToken
                }
            });
            
            // Adiciona listeners para debug
            this.locationSocket.on('connect', () => {
                console.log('✅ Location Socket conectado com sucesso (autenticado)');
            });
            
            this.locationSocket.on('disconnect', (reason) => {
                console.log('❌ Location Socket desconectado:', reason);
            });
            
            this.locationSocket.on('connect_error', (error) => {
                console.log('🚨 Erro de conexão Location Socket:', error.message);
                if (error.message.includes('Token')) {
                    console.log('⚠️ Erro de autenticação JWT. Verifique seu token.');
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
            console.error('❌ Token JWT não encontrado. Faça login primeiro.');
            return;
        }

        if (!this.paymentSocket || !this.paymentSocket.connected) {
            console.log('💳 Inicializando Payment Socket com JWT');
            this.paymentSocket = io(BASE_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                auth: {
                    token: this.jwtToken
                },
                extraHeaders: {
                    Authorization: this.jwtToken
                }
            });

            // Adiciona listeners para debug
            this.paymentSocket.on('connect', () => {
                console.log('✅ Payment Socket conectado com sucesso (autenticado)');
            });
            
            this.paymentSocket.on('disconnect', (reason) => {
                console.log('❌ Payment Socket desconectado:', reason);
            });
            
            this.paymentSocket.on('connect_error', (error) => {
                console.log('🚨 Erro de conexão Payment Socket:', error.message);
                if (error.message.includes('Token')) {
                    console.log('⚠️ Erro de autenticação JWT. Verifique seu token.');
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