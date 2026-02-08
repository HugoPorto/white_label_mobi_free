// ChatIntegrationExample.tsx
// Exemplo de como integrar a interface de chat no seu app

import React from 'react';
import { TouchableOpacity, View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ChatScreen from './ChatScreen'; // Descomente quando o ChatScreen estiver pronto
// import { ChatConfig, ChatUtils, Message } from './ChatConfig'; // Descomente quando necessário

// Tipos temporários (use os do ChatConfig quando disponível)
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'audio' | 'system';
};

// Configuração temporária (use o ChatConfig quando disponível)
const TempChatConfig = {
  ui: { primaryColor: '#FC7700', maxMessageLength: 1000 },
  autoReplies: [
    'Olá! Como posso ajudar você hoje?',
    'Estou analisando sua solicitação...',
    'Obrigado por entrar em contato!',
  ],
};

// Utilitários temporários (use o ChatUtils quando disponível)
const TempChatUtils = {
  generateMessageId: (): string => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  validateMessage: (text: string): { isValid: boolean; error?: string } => {
    if (!text.trim()) return { isValid: false, error: 'Mensagem não pode estar vazia' };
    if (text.length > 1000) return { isValid: false, error: 'Mensagem muito longa' };
    return { isValid: true };
  },
};

// Exemplo 1: Botão para abrir o chat
export const ChatButton: React.FC = () => {
  const navigation = useNavigation();

  const openChat = () => {
    // navigation.navigate('ChatScreen'); // Descomente quando tiver navegação configurada
    Alert.alert('Chat', 'Abrindo interface de chat...');
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: TempChatConfig.ui.primaryColor,
        padding: 15,
        borderRadius: 25,
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
      onPress={openChat}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>💬 Suporte</Text>
    </TouchableOpacity>
  );
};

// Exemplo 2: Integração com sistema de navegação (exemplo conceitual)
export const ChatNavigationSetup = () => {
  // Adicione esta tela no seu NavigationContainer
  // Descomente quando tiver o Stack Navigator e ChatScreen prontos
  /*
  return (
    <Stack.Screen
      name="ChatScreen"
      component={ChatScreen}
      options={{
        headerShown: false,
        presentation: 'modal',
        animationTypeForReplace: 'push',
      }}
    />
  );
  */
  
  console.log('Configure o Stack Navigator com ChatScreen quando estiver pronto');
  return null;
};

// Exemplo 3: Hook personalizado para gerenciar chat
export const useChatManager = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);

  // Simula recebimento de mensagem
  const simulateReceiveMessage = (text: string, delay: number = 2000) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: TempChatUtils.generateMessageId(),
        text,
        sender: 'support',
        timestamp: new Date(),
        status: 'delivered',
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, delay);
  };

  // Envia mensagem do usuário
  const sendUserMessage = (text: string) => {
    const validation = TempChatUtils.validateMessage(text);
    if (!validation.isValid) {
      Alert.alert('Erro', validation.error);
      return;
    }

    const userMessage: Message = {
      id: TempChatUtils.generateMessageId(),
      text,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);

    // Simula envio
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );

      // Resposta automática
      const randomReply =
        TempChatConfig.autoReplies[
          Math.floor(Math.random() * TempChatConfig.autoReplies.length)
        ];
      simulateReceiveMessage(randomReply);
    }, 1000);
  };

  // Manipula ações rápidas
  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'emergency':
        Alert.alert(
          '🚨 Emergência',
          'Conectando com central de emergência...',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Continuar', 
              onPress: () => {
                // Implementar lógica de emergência
                sendUserMessage('🚨 EMERGÊNCIA - Preciso de ajuda urgente!');
              }
            },
          ]
        );
        break;

      case 'shareLocation':
        // Implementar compartilhamento de localização
        sendUserMessage('📍 Compartilhando minha localização atual...');
        simulateReceiveMessage('Localização recebida! Analisando sua posição.');
        break;

      case 'rideInfo':
        // Implementar informações da corrida
        sendUserMessage('🚗 Gostaria de informações sobre minha corrida atual');
        simulateReceiveMessage('Verificando os detalhes da sua corrida...');
        break;

      case 'rating':
        // Implementar avaliação
        sendUserMessage('⭐ Gostaria de avaliar o motorista');
        simulateReceiveMessage('Ótimo! Vou abrir a tela de avaliação para você.');
        break;

      default:
        console.log('Ação não implementada:', actionId);
    }
  };

  return {
    messages,
    isTyping,
    sendUserMessage,
    handleQuickAction,
    simulateReceiveMessage,
  };
};

// Exemplo 4: Componente de chat customizado
export const CustomChatScreen: React.FC = () => {
  const {
    messages,
    isTyping,
    sendUserMessage,
    handleQuickAction,
  } = useChatManager();

  const supportAgent = {
    name: 'Suporte Partiu',
    isOnline: true,
  };

  // Descomente quando o ChatScreen estiver pronto
  /*
  return (
    <ChatScreen
      initialMessages={messages}
      onSendMessage={sendUserMessage}
      onQuickAction={handleQuickAction}
      supportAgent={supportAgent}
    />
  );
  */
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ChatScreen será implementado aqui</Text>
      <Text>Mensagens: {messages.length}</Text>
      <Text>Digitando: {isTyping ? 'Sim' : 'Não'}</Text>
    </View>
  );
};

// Exemplo 5: Integração com AsyncStorage para persistir mensagens
export const usePersistentChat = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);

  // Carrega mensagens salvas
  React.useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem('chat_messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    loadMessages();
  }, []);

  // Salva mensagens quando mudarem
  React.useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('chat_messages', JSON.stringify(messages));
      } catch (error) {
        console.error('Erro ao salvar mensagens:', error);
      }
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  return { messages, setMessages };
};

// Exemplo 6: Notificações push para novas mensagens
export const ChatNotificationManager = {
  // Configura notificações locais
  setupNotifications: async () => {
    // Implementar com expo-notifications ou react-native-push-notification
    console.log('Configurando notificações do chat...');
  },

  // Envia notificação para nova mensagem
  sendMessageNotification: (message: Message) => {
    if (message.sender === 'support') {
      // Mostrar notificação apenas para mensagens do suporte
      console.log('Nova mensagem do suporte:', message.text);
    }
  },
};

// Instruções de uso:
/*
1. Adicione o ChatScreen no seu sistema de navegação
2. Use o ChatButton onde quiser mostrar acesso ao chat
3. Customize as cores e textos no ChatConfig.ts
4. Implemente as integrações específicas do seu app
5. Teste em dispositivos iOS e Android
*/

export default {
  ChatButton,
  ChatNavigationSetup,
  useChatManager,
  CustomChatScreen,
  usePersistentChat,
  ChatNotificationManager,
};
