// ChatConfig.ts
// Configurações da interface de chat

export const ChatConfig = {
  // Configurações de UI
  ui: {
    primaryColor: '#4CAF50',
    backgroundColor: '#F8F9FA',
    userBubbleColor: '#4CAF50',
    supportBubbleColor: '#FFFFFF',
    textColor: '#333333',
    secondaryTextColor: '#666666',
    maxMessageLength: 1000,
    animationDuration: 300,
  },

  // Configurações de comportamento
  behavior: {
    autoScrollToBottom: true,
    showTypingIndicator: true,
    autoReplyDelay: 2000, // 2 segundos
    recordingMaxDuration: 60000, // 1 minuto
    showReadReceipts: true,
  },

  // Textos da interface
  texts: {
    headerTitle: 'Carlos - Motorista',
    statusOnline: 'A caminho',
    statusOffline: 'Offline',
    placeholder: 'Converse com seu motorista...',
    recording: 'Gravando áudio...',
    typing: 'Motorista está digitando...',
    emergencyButton: '🚨 Emergência',
    locationButton: '📍 Localização',
    rideInfoButton: '🚗 Detalhes da viagem',
    callDriverButton: '📞 Ligar para motorista',
  },

  // Mensagens automáticas do motorista
  autoReplies: [
    'Olá! Sou seu motorista, já estou a caminho!',
    'Certo! Já anotei aqui.',
    'Sem problemas! Estou vendo sua localização.',
    'Perfeito! Te aviso quando estiver chegando.',
    'Ok! Qualquer coisa me avise.',
  ],

  // Quick Actions para comunicação passageiro-motorista
  quickActions: [
    {
      id: 'emergency',
      icon: '🚨',
      label: 'Emergência',
      action: 'emergency',
      urgent: true,
    },
    {
      id: 'location',
      icon: '📍',
      label: 'Compartilhar Localização',
      action: 'shareLocation',
    },
    {
      id: 'ride-info',
      icon: '🚗',
      label: 'Detalhes da Viagem',
      action: 'rideInfo',
    },
    {
      id: 'call-driver',
      icon: '📞',
      label: 'Ligar para Motorista',
      action: 'callDriver',
    },
  ],
};

// Tipos TypeScript
export interface Message {
  id: string;
  text: string;
  sender: 'passenger' | 'driver';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'audio' | 'system' | 'location';
}

export interface ChatProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
  onQuickAction?: (actionId: string) => void;
  driverInfo?: {
    name: string;
    avatar?: string;
    vehicle: {
      model: string;
      color: string;
      plate: string;
    };
    isOnline: boolean;
    estimatedArrival?: string;
  };
}

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  action: string;
  urgent?: boolean;
}

// Utilitários
export const ChatUtils = {
  // Gera ID único para mensagens
  generateMessageId: (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Formata timestamp
  formatTime: (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Formata data para separador
  formatDate: (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  },

  // Verifica se precisa mostrar separador de data
  shouldShowDateSeparator: (
    currentMessage: Message,
    previousMessage?: Message
  ): boolean => {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();

    return currentDate !== previousDate;
  },

  // Valida mensagem
  validateMessage: (text: string): { isValid: boolean; error?: string } => {
    if (!text.trim()) {
      return { isValid: false, error: 'Mensagem não pode estar vazia' };
    }

    if (text.length > ChatConfig.ui.maxMessageLength) {
      return {
        isValid: false,
        error: `Mensagem muito longa (máx. ${ChatConfig.ui.maxMessageLength} caracteres)`,
      };
    }

    return { isValid: true };
  },
};

export default ChatConfig;
