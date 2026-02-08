# Guia de Migração: Socket com JWT no React Native

## 📋 Visão Geral

Este guia explica como atualizar seu código React Native para usar sockets autenticados com JWT.

## 🔄 Mudanças Implementadas

### 1. SocketService.tsx
- ✅ Adicionado suporte a JWT Token
- ✅ Token carregado automaticamente do AsyncStorage
- ✅ Método `setToken()` para atualizar token após login
- ✅ Ambos sockets (Location e Payment) autenticados

### 2. DriverMyLocationMapViewModel.tsx
- ✅ Métodos `initLocationSocket()` e `initPaymentSocket()` agora são assíncronos
- ✅ Novo método `setSocketToken()` para atualizar token
- ✅ `initSocket()` agora aguarda inicialização

## 🚀 Como Usar

### 1. No Login (LoginScreen.tsx)

Após o login bem-sucedido, atualize o token no SocketService:

```typescript
// No handleLogin, após saveAuthSession
if ('token' in response) {
    saveAuthSession(response);
    
    // NOVO: Atualizar token nos sockets
    const viewModel: DriverMyLocationMapViewModel = 
        container.resolve('driverMyLocationMapViewModel');
    viewModel.setSocketToken(response.token);
    
    // Resto do código...
}
```

### 2. No DriverMyLocationMapScreen.tsx

Atualize a inicialização dos sockets para usar `await`:

**ANTES:**
```typescript
const connectToSocket = () => {
    console.log('📡 Iniciando conexão com socket...');
    viewModel.initSocket();
};
```

**DEPOIS:**
```typescript
const connectToSocket = async () => {
    console.log('📡 Iniciando conexão com socket...');
    await viewModel.initSocket();
    console.log('✅ Sockets inicializados com JWT');
};
```

### 3. Verificação de Conexão

```typescript
// Verificar se está conectado
const checkConnection = () => {
    const locationConnected = viewModel.isLocationConnected();
    const paymentConnected = viewModel.isPaymentConnected();
    
    console.log('Location Socket:', locationConnected ? '✅' : '❌');
    console.log('Payment Socket:', paymentConnected ? '✅' : '❌');
};

// Aguardar conexão
const waitForConnection = async () => {
    const connected = await viewModel.waitForLocationConnection(5000);
    if (connected) {
        console.log('✅ Conectado ao Location Socket');
    } else {
        console.log('❌ Falha ao conectar ao Location Socket');
    }
};
```

## 🔧 Código de Exemplo Completo

### LoginScreen.tsx

```typescript
const handleLogin = async () => {
    if (!isFormValid()) return;
    
    setIsLoading(true);

    try {
        const device_id = await DeviceInfo.getUniqueId();
        const response = await loginViewModel.login(email, password, device_id);

        if ('token' in response) {
            // Salvar sessão
            saveAuthSession(response);
            
            // IMPORTANTE: Atualizar token nos sockets
            const driverViewModel: DriverMyLocationMapViewModel = 
                container.resolve('driverMyLocationMapViewModel');
            driverViewModel.setSocketToken(response.token);
            
            console.log('🔑 Token atualizado nos sockets');

            // Obter token de notificação
            getToken().then(token => {
                if (token) {
                    loginViewModel.updateNotificationToken(response.user.id!, token);
                }
            });

            // Navegar para a tela apropriada
            const hasDriverRole = response.user.roles?.some(role => role.id === 'DRIVER');
            
            if (hasDriverRole) {
                navigation.replace('DriverTabsNavigator' as never);
            } else {
                navigation.replace('ClientTabsNavigator' as never);
            }
        } else {
            showAlert('Erro', 'E-mail ou senha incorretos.');
        }
    } catch (error) {
        showAlert('Erro', 'Falha na conexão. Verifique sua internet.');
    } finally {
        setIsLoading(false);
    }
};
```

### DriverMyLocationMapScreen.tsx

```typescript
// Função para conectar aos sockets
const connectToSocket = async () => {
    try {
        console.log('📡 Iniciando conexão com sockets...');
        
        // Inicializa ambos os sockets (Location e Payment)
        await viewModel.initSocket();
        
        // Aguarda a conexão do Location Socket
        const locationConnected = await viewModel.waitForLocationConnection(5000);
        
        if (locationConnected) {
            console.log('✅ Location Socket conectado e autenticado');
            
            // Verifica Payment Socket
            if (viewModel.isPaymentConnected()) {
                console.log('✅ Payment Socket conectado e autenticado');
            }
        } else {
            console.log('❌ Falha ao conectar Location Socket');
            // Tentar reconectar ou mostrar erro ao usuário
        }
    } catch (error) {
        console.error('❌ Erro ao conectar sockets:', error);
    }
};

// Chamar no useEffect ou ao iniciar tracking
useEffect(() => {
    if (authResponse?.token) {
        connectToSocket();
    }
    
    return () => {
        viewModel.disconnectAllSockets();
    };
}, []);

// Função para iniciar tracking com sockets autenticados
const handleStartTracking = async () => {
    // Primeiro garante que está conectado
    if (!viewModel.isLocationConnected()) {
        await connectToSocket();
    }
    
    // Aguarda a conexão
    const connected = await viewModel.waitForLocationConnection(3000);
    
    if (connected) {
        setTracking(true);
        startLocationUpdates();
    } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor');
    }
};
```

## 🔒 Segurança

### Token Expirado

Se o token expirar, os sockets serão desconectados automaticamente. Implemente lógica de refresh:

```typescript
// Monitorar erros de autenticação
useEffect(() => {
    const handleConnectionError = async () => {
        if (!viewModel.isLocationConnected()) {
            // Token pode ter expirado
            console.log('⚠️ Socket desconectado, tentando reconectar...');
            
            // Recarregar token do AsyncStorage
            const authData = await getAuthSession();
            
            if (authData?.token) {
                viewModel.setSocketToken(authData.token);
                await connectToSocket();
            } else {
                // Token inválido, fazer logout
                console.log('❌ Token inválido, fazendo logout...');
                removeAuthSession();
                navigation.replace('LoginScreen');
            }
        }
    };
    
    // Verificar conexão a cada 30 segundos
    const interval = setInterval(handleConnectionError, 30000);
    
    return () => clearInterval(interval);
}, []);
```

## 🐛 Troubleshooting

### 1. Socket não conecta

**Problema:** Socket não conecta após login

**Solução:**
```typescript
// Verificar se o token foi definido
console.log('Token definido?', authResponse?.token ? 'Sim' : 'Não');

// Recarregar token manualmente
const viewModel = container.resolve('driverMyLocationMapViewModel');
if (authResponse?.token) {
    viewModel.setSocketToken(authResponse.token);
    await viewModel.initSocket();
}
```

### 2. Erro "Token não fornecido"

**Problema:** Socket recusa conexão com erro de token

**Solução:**
1. Verificar se `saveAuthSession()` foi chamado
2. Verificar se `setSocketToken()` foi chamado após login
3. Verificar logs no console

```typescript
// Debug completo
const debugSocket = async () => {
    const authData = await LocalStorage.getData('auth');
    console.log('Auth Data:', authData ? 'Existe' : 'Não existe');
    
    if (authData) {
        const parsed = JSON.parse(authData);
        console.log('Token:', parsed.token ? 'Definido' : 'Indefinido');
    }
    
    console.log('Location Connected:', viewModel.isLocationConnected());
    console.log('Payment Connected:', viewModel.isPaymentConnected());
};
```

### 3. Socket desconecta após alguns segundos

**Problema:** Token expirado ou inválido

**Solução:**
```typescript
// Verificar expiração do token
const checkTokenExpiration = (token: string) => {
    try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        const expiration = payload.exp * 1000; // Converter para ms
        const now = Date.now();
        
        console.log('Token expira em:', new Date(expiration));
        console.log('Está expirado?', expiration < now);
        
        return expiration < now;
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return true;
    }
};
```

## 📊 Logs Úteis

### Console do App

```
🔑 Token JWT carregado para SocketService
🚗 Inicializando Location Socket com JWT
✅ Location Socket conectado com sucesso (autenticado)
💳 Inicializando Payment Socket com JWT
✅ Payment Socket conectado com sucesso (autenticado)
📡 Emitindo posição via change_driver_position: {...}
```

### Console do Servidor (NestJS)

```
[SocketGateway] Usuário autenticado conectado ao SOCKET: abc123
[SocketGateway] Usuário: João Silva (ID: 42)
[WsJwtGuard] Usuário autenticado via WebSocket: João Silva (ID: 42)
```

### Erros Comuns

```
❌ Token JWT não encontrado. Faça login primeiro.
🚨 Erro de conexão Location Socket: Token inválido ou expirado
⚠️ Erro de autenticação JWT. Verifique seu token.
```

## ✅ Checklist de Migração

- [ ] SocketService.tsx atualizado
- [ ] DriverMyLocationMapViewModel.tsx atualizado
- [ ] LoginScreen.tsx chama `setSocketToken()` após login
- [ ] DriverMyLocationMapScreen.tsx usa `await` na inicialização
- [ ] Testado fluxo completo de login
- [ ] Testado envio de posição do motorista
- [ ] Testado recebimento de notificações PPS
- [ ] Implementado tratamento de erros de autenticação
- [ ] Testado reconexão após perda de conexão

## 📝 Notas Importantes

1. **Sempre chame `setSocketToken()` após login bem-sucedido**
2. **Use `await` ao inicializar sockets**
3. **Implemente tratamento para token expirado**
4. **Monitore logs para debug de autenticação**
5. **Teste em dispositivos reais, não apenas no emulador**

## 🔗 Arquivos Relacionados

- `SocketService.tsx` - Serviço de socket com JWT
- `DriverMyLocationMapViewModel.tsx` - ViewModel atualizado
- `WEBSOCKET_JWT_AUTH.md` - Documentação do backend
- `useAuth.tsx` - Hook de autenticação
- `AuthContext.tsx` - Contexto de autenticação

---

**Versão:** 1.0.0  
**Data:** 03/01/2026  
**Compatibilidade:** React Native 0.70+, Socket.IO Client 4.x
