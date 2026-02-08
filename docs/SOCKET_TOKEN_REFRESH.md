# Sistema de Refresh Automático de Token no Socket

## 📋 Visão Geral

Este documento descreve como o sistema de **refresh automático de token JWT** funciona para garantir que os sockets (Location e Payment) permaneçam conectados mesmo quando o token expira.

## 🔄 Fluxo de Funcionamento

### 1. **Login Inicial**
```
Usuário faz login → Recebe:
- token (JWT com expiração de 2 dias)
- refresh_token (hash único)
- session_id (identificador da sessão)
```

### 2. **Conexão do Socket**
```
Socket se conecta usando o JWT token no auth header
```

### 3. **Detecção de Expiração**

O sistema detecta token expirado em 3 cenários:

#### A) **Erro de Conexão (`connect_error`)**
```typescript
this.locationSocket.on('connect_error', async (error) => {
    if (error.message.includes('Token') || 
        error.message.includes('jwt') || 
        error.message.includes('expired')) {
        // Token expirou! Renovar automaticamente
    }
});
```

#### B) **Evento `unauthorized` do Servidor**
```typescript
this.locationSocket.on('unauthorized', async (error) => {
    // Servidor rejeitou a autenticação
    // Renovar token automaticamente
});
```

#### C) **Verificação Manual**
O app pode chamar `socketService.refreshTokenIfNeeded()` manualmente se necessário.

### 4. **Processo de Renovação Automática**

```typescript
async refreshTokenIfNeeded() {
    // 1. Chama endpoint /auth/refresh com refresh_token
    const response = await fetch('/auth/refresh', {
        body: { refresh_token: this.refreshToken }
    });
    
    // 2. Recebe novo token JWT
    const { token, refresh_token, session_id } = await response.json();
    
    // 3. Atualiza tokens no SocketService
    await this.setToken(token, refresh_token, session_id);
    
    // 4. Salva no AsyncStorage
    await localStorage.setItem('auth', JSON.stringify({
        token, refresh_token, session_id
    }));
    
    // 5. Reconecta sockets automaticamente
    this.disconnectLocationSocket();
    await this.initLocationSocket();
}
```

### 5. **Reconexão Automática**

Quando o token é renovado, os sockets são reconectados automaticamente:

```typescript
async setToken(token, refreshToken?, sessionId?) {
    this.jwtToken = token;
    
    // Reconecta Location Socket se estava conectado
    if (this.isLocationConnected()) {
        this.disconnectLocationSocket();
        await this.initLocationSocket(); // Usa novo token
    }
    
    // Reconecta Payment Socket se estava conectado
    if (this.isPaymentConnected()) {
        this.disconnectPaymentSocket();
        await this.initPaymentSocket(); // Usa novo token
    }
}
```

### 6. **Falha na Renovação**

Se a renovação falhar (refresh_token inválido/expirado):

```typescript
// SocketService notifica através de callback local
if (this.authFailedCallback) {
    this.authFailedCallback({ 
        reason: 'Token expirado e não foi possível renovar' 
    });
}

// DriverMyLocationMapScreen escuta o evento
viewModel.onAuthFailed((error) => {
    Alert.alert(
        'Sessão Expirada',
        'Por favor, faça login novamente',
        [{ text: 'OK', onPress: () => navigation.replace('LoginScreen') }]
    );
});
```

## 🔐 Backend (NestJS)

### Endpoint de Refresh

```typescript
// auth.controller.ts
@Post('refresh')
refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
}

// auth.service.ts
async refresh(refreshToken: string) {
    // 1. Busca sessão ativa com esse refresh_token
    const session = await this.userSessionRepository.findOne({
        where: { 
            refresh_token_hash: refreshToken,
            is_active: true 
        }
    });
    
    // 2. Valida sessão
    if (!session) {
        throw new HttpException('Sessão inválida', 401);
    }
    
    // 3. Gera novo JWT token (2 dias)
    const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '2d'
    });
    
    // 4. Atualiza sessão
    await this.userSessionRepository.update(session.id, {
        access_token: newAccessToken,
        last_activity: new Date()
    });
    
    // 5. Retorna novo token
    return {
        user: session.user,
        token: 'Bearer ' + newAccessToken,
        refresh_token: session.refresh_token_hash,
        session_id: session.id
    };
}
```

## 📱 Integração no App

### SocketService.tsx
```typescript
✅ Armazena: token, refresh_token, session_id
✅ Detecta: Erros de autenticação automaticamente
✅ Renova: Token via API /auth/refresh
✅ Reconecta: Sockets automaticamente
✅ Notifica: Via callback local quando renovação falhar
```

### DriverMyLocationMapViewModel.tsx
```typescript
✅ Expõe método: onAuthFailed(callback)
✅ Permite app reagir: Quando renovação falhar
```

### DriverMyLocationMapScreen.tsx
```typescript
✅ Escuta: Evento 'auth_failed'
✅ Alerta: Usuário sobre sessão expirada
✅ Redireciona: Para tela de login
```

## 🎯 Vantagens

1. **Transparente**: Usuário não percebe renovação
2. **Automático**: Nenhuma ação manual necessária
3. **Seguro**: Usa refresh_token com hash
4. **Resiliente**: Trata falhas de renovação
5. **Sem Interrupção**: Socket reconecta automaticamente

## ⚠️ Pontos de Atenção

### 1. **Race Condition**
```typescript
private isRefreshing: boolean = false; // Previne múltiplas renovações simultâneas
```

### 2. **Token Inválido**
Se o refresh_token estiver inválido/expirado, o usuário precisa fazer login novamente.

### 3. **Sessão Invalidada**
Se a sessão for invalidada no backend (`is_active = false`), a renovação falhará.

### 4. **Conexão de Rede**
Certifique-se de ter conexão com internet para renovar o token.

## 🧪 Testando

### Teste Manual de Expiração

1. **Reduzir tempo de expiração no backend**:
```typescript
// auth.module.ts
JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '10s' } // ⚠️ APENAS PARA TESTE
})
```

2. **Fazer login no app**

3. **Aguardar 10 segundos**

4. **Tentar usar o socket** (emitir posição, por exemplo)

5. **Observar logs**:
```
🚨 Erro de conexão Location Socket: jwt expired
⚠️ Token expirado. Tentando renovar...
🔄 Renovando token expirado...
✅ Token renovado com sucesso
🔄 Reconectando Location Socket com novo token...
✅ Location Socket conectado com sucesso
```

### Teste de Falha de Renovação

1. **Invalidar sessão no banco de dados**:
```sql
UPDATE user_sessions SET is_active = false WHERE id = 'session_id';
```

2. **Tentar usar o socket**

3. **Deve mostrar alerta**: "Sessão Expirada - Faça login novamente"

## 📊 Fluxograma

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Salva token,       │
│  refresh_token,     │
│  session_id         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Socket conecta     │
│  com JWT token      │
└──────┬──────────────┘
       │
       ▼
   ┌───────┐
   │ Uso   │◄─────────────┐
   │Normal │              │
   └───┬───┘              │
       │                  │
       ▼                  │
  ┌──────────┐            │
  │Token OK? │            │
  └────┬─────┘            │
       │                  │
   Não │  Sim             │
       ▼    └─────────────┘
  ┌──────────────┐
  │ Detecta      │
  │ Expiração    │
  └───────┬──────┘
          │
          ▼
  ┌──────────────┐
  │ Chama API    │
  │ /auth/refresh│
  └───────┬──────┘
          │
    ┌─────┴─────┐
    │           │
Sucesso      Falha
    │           │
    ▼           ▼
┌───────┐   ┌────────┐
│Renova │   │Logout  │
│Token  │   │Forçado │
└───┬───┘   └────────┘
    │
    ▼
┌──────────┐
│Reconecta │
│Socket    │
└──────────┘
```

## 🔧 Configurações

### Backend (NestJS)
- **Expiração JWT**: 2 dias (`expiresIn: '2d'`)
- **Refresh Token**: Válido enquanto sessão estiver ativa
- **Sessão**: Invalidada após logout ou novo login

### Frontend (React Native)
- **Auto-refresh**: Habilitado por padrão
- **Retry de conexão**: 5 tentativas com delay de 3s
- **Timeout de renovação**: 5s

## 📝 Manutenção

### Logs Importantes

```typescript
// Socket conectado
✅ Location Socket conectado com sucesso (autenticado)

// Token expirado
🚨 Erro de conexão: jwt expired
⚠️ Token expirado. Tentando renovar...

// Renovação em progresso
🔄 Renovando token expirado...

// Renovação bem-sucedida
✅ Token renovado com sucesso
🔑 Token JWT atualizado no SocketService
🔄 Reconectando Location Socket com novo token...

// Renovação falhou
❌ Erro ao renovar token: 401
❌ Não foi possível renovar o token
```

## 🚀 Próximas Melhorias

- [ ] Renovação preventiva (antes de expirar)
- [ ] Métricas de renovação de token
- [ ] Notificação silenciosa ao renovar
- [ ] Retry com backoff exponencial
- [ ] Cache de tokens renovados

---

**Autor**: PARTIU DEV TEAM | Hugo Porto  
**Data**: 26-01-2026  
**Versão**: 1.0
