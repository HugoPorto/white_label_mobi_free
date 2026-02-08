import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ChatScreenStyles';

interface QuickAction {
    id: string;
    title: string;
    icon: string;
    action: () => void;
}

interface QuickActionsProps {
    visible: boolean;
    onActionPress: (action: string) => void;
}

export function QuickActions({ visible, onActionPress }: QuickActionsProps) {
    if (!visible) return null;

    const quickActions: QuickAction[] = [
        {
            id: 'location',
            title: 'Enviar localização',
            icon: 'location',
            action: () => onActionPress('location'),
        },
        {
            id: 'ride_info',
            title: 'Detalhes da viagem',
            icon: 'car',
            action: () => onActionPress('ride_info'),
        },
        {
            id: 'call_driver',
            title: 'Ligar para motorista',
            icon: 'call',
            action: () => onActionPress('call_driver'),
        },
        {
            id: 'emergency',
            title: 'Emergência',
            icon: 'warning',
            action: () => onActionPress('emergency'),
        },
    ];

    return (
        <View style={styles.quickActionsContainer}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
            >
                {quickActions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={styles.quickAction}
                        onPress={action.action}
                    >
                        <Ionicons 
                            name={action.icon as any} 
                            size={16} 
                            color="#FC7700" 
                            style={{ marginRight: 4 }}
                        />
                        <Text style={styles.quickActionText}>
                            {action.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

// Componente para mensagens do sistema
interface SystemMessageProps {
    text: string;
}

export function SystemMessage({ text }: SystemMessageProps) {
    return (
        <View style={styles.systemMessage}>
            <Text style={styles.systemMessageText}>{text}</Text>
        </View>
    );
}

// Componente para separador de data
interface DateSeparatorProps {
    date: Date;
}

export function DateSeparator({ date }: DateSeparatorProps) {
    const formatDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

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
    };

    return (
        <View style={styles.dateSeparator}>
            <Text style={styles.dateSeparatorText}>
                {formatDate(date)}
            </Text>
        </View>
    );
}

// Componente para mensagem de imagem (para futuras implementações)
interface ImageMessageProps {
    imageUri: string;
    onPress?: () => void;
}

export function ImageMessage({ imageUri, onPress }: ImageMessageProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            {/* Placeholder para imagem - implementar com Image component */}
            <View style={[styles.imageMessage, { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }]}>
                <Ionicons name="image" size={40} color="#ccc" />
            </View>
        </TouchableOpacity>
    );
}

// Componente para mensagem de áudio (para futuras implementações)
interface AudioMessageProps {
    duration: number;
    isPlaying: boolean;
    onPlayPress: () => void;
}

export function AudioMessage({ duration, isPlaying, onPlayPress }: AudioMessageProps) {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.audioMessage}>
            <TouchableOpacity style={styles.audioButton} onPress={onPlayPress}>
                <Ionicons 
                    name={isPlaying ? "pause" : "play"} 
                    size={16} 
                    color="#fff" 
                />
            </TouchableOpacity>
            <Text style={styles.audioDuration}>
                {formatDuration(duration)}
            </Text>
        </View>
    );
}
