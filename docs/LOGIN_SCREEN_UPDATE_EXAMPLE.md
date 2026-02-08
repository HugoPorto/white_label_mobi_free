# Exemplo de Atualização: LoginScreen.tsx

## Adicionar após o login bem-sucedido

Localize a linha onde `saveAuthSession(response)` é chamado e adicione o código para atualizar o token nos sockets:

```typescript
// ANTES
if ('token' in response) {
    saveAuthSession(response);

    // Obter e atualizar token de notificação
    getToken().then(token => {
        if (token) {
            loginViewModel.updateNotificationToken(response.user.id!, token);
        }
    }).catch(error => {
        console.log('Erro ao obter token de notificação:', error);
    });

    const hasDriverRole = response.user.roles?.some(role => role.id === 'DRIVER');
    // ... resto do código
}

// DEPOIS
if ('token' in response) {
    saveAuthSession(response);

    // 🆕 NOVO: Atualizar token nos sockets
    try {
        const driverViewModel: DriverMyLocationMapViewModel = 
            container.resolve('driverMyLocationMapViewModel');
        driverViewModel.setSocketToken(response.token);
        console.log('✅ Token JWT atualizado nos sockets');
    } catch (error) {
        console.log('⚠️ Aviso: Não foi possível atualizar token nos sockets:', error);
    }

    // Obter e atualizar token de notificação
    getToken().then(token => {
        if (token) {
            loginViewModel.updateNotificationToken(response.user.id!, token);
        }
    }).catch(error => {
        console.log('Erro ao obter token de notificação:', error);
    });

    const hasDriverRole = response.user.roles?.some(role => role.id === 'DRIVER');
    // ... resto do código
}
```

## Import necessário

Adicione no início do arquivo:

```typescript
import { DriverMyLocationMapViewModel } from '../../driver/myLocationMap/DriverMyLocationMapViewModel';
import { container } from '../../../../di/Container';
```
