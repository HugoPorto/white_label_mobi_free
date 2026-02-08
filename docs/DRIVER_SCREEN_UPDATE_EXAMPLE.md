# Exemplo de Atualização: DriverMyLocationMapScreen.tsx

## 1. Atualizar função connectToSocket

Localize a função `connectToSocket` e torne-a assíncrona:

```typescript
// ANTES
const connectToSocket = () => {
    console.log('📡 Iniciando conexão com socket...');
    viewModel.initSocket();
};

// DEPOIS
const connectToSocket = async () => {
    try {
        console.log('📡 Iniciando conexão com sockets...');
        
        // Garante que o token está disponível
        if (!authResponse?.token) {
            console.log('⚠️ Token não disponível, aguardando...');
            return;
        }
        
        // Inicializa ambos os sockets com JWT
        await viewModel.initSocket();
        
        // Aguarda conexão do Location Socket
        const locationConnected = await viewModel.waitForLocationConnection(5000);
        
        if (locationConnected) {
            console.log('✅ Location Socket conectado e autenticado com JWT');
            
            // Verifica Payment Socket
            if (viewModel.isPaymentConnected()) {
                console.log('✅ Payment Socket conectado e autenticado com JWT');
            } else {
                console.log('⚠️ Payment Socket não conectado ainda');
            }
        } else {
            console.log('❌ Falha ao conectar Location Socket');
            Alert.alert(
                'Erro de Conexão',
                'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
            );
        }
    } catch (error) {
        console.error('❌ Erro ao conectar sockets:', error);
    }
};
```

## 2. Atualizar useEffect de inicialização

```typescript
// ANTES
useEffect(() => {
    if (authResponse?.user.id) {
        connectToSocket();
    }
    
    return () => {
        viewModel.disconnectSocket();
    };
}, []);

// DEPOIS
useEffect(() => {
    const initializeConnection = async () => {
        if (authResponse?.user.id && authResponse?.token) {
            // Garante que o token está definido
            viewModel.setSocketToken(authResponse.token);
            
            // Conecta aos sockets
            await connectToSocket();
        }
    };
    
    initializeConnection();
    
    return () => {
        console.log('🔌 Limpando conexões de socket...');
        viewModel.disconnectAllSockets();
    };
}, [authResponse]);
```

## 3. Atualizar função de iniciar tracking

```typescript
// ANTES
const handleStartTracking = () => {
    if (!tracking) {
        setTracking(true);
        startLocationUpdates();
    }
};

// DEPOIS
const handleStartTracking = async () => {
    if (!tracking) {
        // Verifica se está conectado
        if (!viewModel.isLocationConnected()) {
            console.log('⚠️ Socket não conectado, tentando conectar...');
            await connectToSocket();
        }
        
        // Aguarda conexão
        const connected = await viewModel.waitForLocationConnection(3000);
        
        if (connected) {
            console.log('✅ Socket pronto, iniciando tracking');
            setTracking(true);
            startLocationUpdates();
        } else {
            Alert.alert(
                'Erro',
                'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
            );
        }
    }
};
```

## 4. Adicionar monitoramento de reconexão

Adicione um novo useEffect para monitorar a conexão:

```typescript
// NOVO: Monitorar status da conexão
useEffect(() => {
    const checkConnectionInterval = setInterval(() => {
        if (tracking && !viewModel.isLocationConnected()) {
            console.log('⚠️ Conexão perdida durante tracking, tentando reconectar...');
            
            // Tenta reconectar
            connectToSocket().catch(error => {
                console.error('❌ Erro ao reconectar:', error);
            });
        }
    }, 10000); // Verifica a cada 10 segundos
    
    return () => clearInterval(checkConnectionInterval);
}, [tracking]);
```

## 5. Adicionar tratamento de erros de autenticação

```typescript
// NOVO: Adicionar após outros useEffects
useEffect(() => {
    const handleAuthError = async () => {
        // Verifica se os sockets estão desconectados por erro de autenticação
        if (authResponse?.token && !isReconnecting.current) {
            const locationConnected = viewModel.isLocationConnected();
            const paymentConnected = viewModel.isPaymentConnected();
            
            if (!locationConnected && !paymentConnected && tracking) {
                console.log('⚠️ Ambos os sockets desconectados, possível erro de autenticação');
                
                isReconnecting.current = true;
                
                try {
                    // Tenta recarregar token e reconectar
                    await getAuthSession();
                    
                    if (authResponse?.token) {
                        viewModel.setSocketToken(authResponse.token);
                        await connectToSocket();
                    } else {
                        // Token inválido, fazer logout
                        Alert.alert(
                            'Sessão Expirada',
                            'Sua sessão expirou. Por favor, faça login novamente.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        removeAuthSession();
                                        rootNavigation.replace('LoginScreen');
                                    }
                                }
                            ]
                        );
                    }
                } catch (error) {
                    console.error('❌ Erro ao reconectar:', error);
                } finally {
                    isReconnecting.current = false;
                }
            }
        }
    };
    
    // Verifica a cada 30 segundos
    const authCheckInterval = setInterval(handleAuthError, 30000);
    
    return () => clearInterval(authCheckInterval);
}, [tracking, authResponse]);
```

## 6. Atualizar função de parar tracking

```typescript
// ANTES
const handleStopTracking = () => {
    setTracking(false);
    stopLocationUpdates();
    viewModel.disconnectSocket();
};

// DEPOIS
const handleStopTracking = () => {
    console.log('🛑 Parando tracking e desconectando Location Socket');
    setTracking(false);
    stopLocationUpdates();
    
    // Desconecta apenas Location Socket, mantém Payment Socket ativo
    viewModel.disconnectSocket();
    
    // Payment Socket continua rodando para receber notificações de pagamento
    if (viewModel.isPaymentConnected()) {
        console.log('💳 Payment Socket permanece ativo para notificações');
    }
};
```

## 7. Adicionar botão de debug (opcional, apenas para desenvolvimento)

```typescript
// NOVO: Adicionar botão de debug no render
{__DEV__ && (
    <TouchableOpacity
        style={{
            position: 'absolute',
            top: 100,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 10,
            borderRadius: 5
        }}
        onPress={() => {
            console.log('=== DEBUG SOCKET STATUS ===');
            console.log('Location Connected:', viewModel.isLocationConnected());
            console.log('Payment Connected:', viewModel.isPaymentConnected());
            console.log('Has Token:', authResponse?.token ? 'Yes' : 'No');
            console.log('Tracking:', tracking);
            console.log('==========================');
            
            Alert.alert('Socket Status', 
                `Location: ${viewModel.isLocationConnected() ? '✅' : '❌'}\n` +
                `Payment: ${viewModel.isPaymentConnected() ? '✅' : '❌'}\n` +
                `Token: ${authResponse?.token ? '✅' : '❌'}\n` +
                `Tracking: ${tracking ? '✅' : '❌'}`
            );
        }}
    >
        <Text style={{ color: 'white', fontSize: 10 }}>DEBUG</Text>
    </TouchableOpacity>
)}
```

## Resumo das Mudanças

✅ `connectToSocket()` agora é `async`  
✅ Verifica token antes de conectar  
✅ Aguarda conexão com `await`  
✅ Adiciona tratamento de erros  
✅ Monitora reconexão automática  
✅ Mantém Payment Socket ativo ao parar tracking  
✅ Detecta sessão expirada  
✅ Botão de debug para desenvolvimento
