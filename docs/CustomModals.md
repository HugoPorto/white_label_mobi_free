# Documentação dos Modais Personalizados

## 🎨 CustomModal

Um modal personalizado que substitui o `Alert.alert()` nativo do React Native com uma interface mais bonita e customizável.

### Características:
- ✨ Animações suaves de entrada e saída
- 🎨 Diferentes tipos visuais (success, error, warning, info)
- 🔲 Múltiplos botões com estilos customizáveis
- 📱 Design responsivo
- 🎭 Ícones contextuais

### Hook useCustomModal

O hook `useCustomModal` facilita o uso dos modais:

```typescript
import { useCustomModal } from '../hooks/useCustomModal';

const MyComponent = () => {
    const { 
        modalConfig, 
        isVisible, 
        hideModal, 
        showSuccess, 
        showError, 
        showWarning, 
        showConfirmation 
    } = useCustomModal();

    // Exemplo de uso
    const handleSuccess = () => {
        showSuccess("Sucesso!", "Operação realizada com sucesso!", () => {
            // Ação após confirmar
            console.log("Usuário clicou OK");
        });
    };

    const handleError = () => {
        showError("Erro!", "Algo deu errado. Tente novamente.");
    };

    const handleConfirmation = () => {
        showConfirmation(
            "Confirmação",
            "Tem certeza que deseja continuar?",
            () => console.log("Confirmado"),
            () => console.log("Cancelado"),
            "Sim, continuar",
            "Cancelar"
        );
    };

    return (
        <View>
            {/* Seus componentes */}
            
            {/* Modal */}
            {modalConfig && (
                <CustomModal
                    visible={isVisible}
                    title={modalConfig.title}
                    message={modalConfig.message}
                    type={modalConfig.type}
                    buttons={modalConfig.buttons}
                    onClose={hideModal}
                />
            )}
        </View>
    );
};
```

### Métodos do Hook

#### showSuccess(title, message, onConfirm?)
Exibe um modal de sucesso com ícone verde ✅

#### showError(title, message, onConfirm?)
Exibe um modal de erro com ícone vermelho ❌

#### showWarning(title, message, onConfirm?)
Exibe um modal de aviso com ícone laranja ⚠️

#### showConfirmation(title, message, onConfirm, onCancel?, confirmText?, cancelText?)
Exibe um modal de confirmação com dois botões

## 🔄 LoadingModal

Um modal de carregamento para operações assíncronas.

### Características:
- ⏳ Spinner animado
- 💬 Mensagem customizável
- 🎨 Estados de sucesso e erro
- 🔄 Animação contínua de rotação

### Exemplo de uso:

```typescript
import LoadingModal from '../components/LoadingModal';

const MyComponent = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAsyncOperation = async () => {
        setIsLoading(true);
        try {
            await someAsyncOperation();
            // Sucesso
        } catch (error) {
            // Erro
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View>
            {/* Seus componentes */}
            
            <LoadingModal
                visible={isLoading}
                message="Processando..."
                type="loading"
            />
        </View>
    );
};
```

## 🎯 Benefícios dos Modais Personalizados

1. **Consistência Visual**: Todos os modais seguem o mesmo design system
2. **Melhor UX**: Animações suaves e feedback visual claro
3. **Flexibilidade**: Fácil customização de cores, textos e ações
4. **Reutilização**: Components reutilizáveis em toda a aplicação
5. **Manutenibilidade**: Código centralizado e organizado
6. **Acessibilidade**: Melhor suporte para leitores de tela
7. **Performance**: Animações otimizadas com `useNativeDriver`

## 🚀 Migração do Alert.alert()

### Antes:
```typescript
Alert.alert("Erro", "Algo deu errado", [
    { text: "OK", onPress: () => console.log("OK") }
]);
```

### Depois:
```typescript
showError("Erro", "Algo deu errado", () => console.log("OK"));
```

Muito mais limpo e com melhor experiência visual! 🎉
