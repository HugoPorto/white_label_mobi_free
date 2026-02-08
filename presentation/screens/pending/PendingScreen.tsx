import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigator/MainStackNavigator";
import { BackHandler, View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Platform, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { SocketService } from "../../../data/sources/remote/services/SocketService";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

interface Props extends StackScreenProps<RootStackParamList, 'PendingScreen'> { };

interface PendingItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconFamily: 'ionicons' | 'material' | 'fontawesome';
    action: () => void;
    isCompleted: boolean;
    priority: 'high' | 'medium' | 'low';
}

export default function PendingScreen({ navigation, route }: Props) {

    const { authResponse, removeAuthSession } = useAuth();
    const socketService = new SocketService();
    const { documents } = route.params;

    // Lista de pendências do usuário
    const [pendingItems, setPendingItems] = useState<PendingItem[]>([
        // {
        //     id: '1',
        //     title: 'Verificar Telefone',
        //     description: 'Confirme seu número de telefone para continuar',
        //     icon: 'phone-portrait-outline',
        //     iconFamily: 'ionicons',
        //     action: () => navigation.navigate('PhoneVerifiedScreen'),
        //     isCompleted: authResponse?.user?.phone_verified || false,
        //     priority: 'high'
        // },
        {
            id: '2',
            title: 'Documentação Pendente',
            description: 'Você possui documentos pendentes de análise ou aprovação, após a aprovação você poderá utilizar o mapa do motorista. Aguarde a análise, ela poderá durar até 3 dias.',
            icon: 'document-text-outline',
            iconFamily: 'ionicons',
            action: () => console.log('Navegar para documentos'),
            isCompleted: !(Array.isArray(documents) && documents.length > 0),
            priority: 'high'
        },
        // {
        //     id: '3',
        //     title: 'Adicionar Foto de Perfil',
        //     description: 'Adicione uma foto para seu perfil',
        //     icon: 'person-circle-outline',
        //     iconFamily: 'ionicons',
        //     action: () => console.log('Navegar para edição de perfil'),
        //     isCompleted: false,
        //     priority: 'medium'
        // },
        // {
        //     id: '4',
        //     title: 'Completar Cadastro',
        //     description: 'Preencha todas as informações obrigatórias',
        //     icon: 'document-text-outline',
        //     iconFamily: 'ionicons',
        //     action: () => console.log('Navegar para completar cadastro'),
        //     isCompleted: false,
        //     priority: 'high'
        // },
        // {
        //     id: '5',
        //     title: 'Aceitar Termos de Uso',
        //     description: 'Leia e aceite nossos termos de serviço',
        //     icon: 'shield-checkmark-outline',
        //     iconFamily: 'ionicons',
        //     action: () => console.log('Navegar para termos'),
        //     isCompleted: false,
        //     priority: 'high'
        // }
    ]);

    const incompleteTasks = pendingItems.filter(item => !item.isCompleted);
    const completeTasks = pendingItems.filter(item => item.isCompleted);
    const progress = (completeTasks.length / pendingItems.length) * 100;

    useFocusEffect(
        React.useCallback(() => {
            socketService.disconnect();
        }, [])
    );

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#e74c3c';
            case 'medium': return '#f39c12';
            case 'low': return '#3498db';
            default: return '#95a5a6';
        }
    };

    const renderIcon = (item: PendingItem) => {
        const iconColor = item.isCompleted ? '#27ae60' : getPriorityColor(item.priority);
        const iconSize = 28;

        if (item.iconFamily === 'ionicons') {
            return <Ionicons name={item.icon as any} size={iconSize} color={iconColor} />;
        } else if (item.iconFamily === 'material') {
            return <MaterialIcons name={item.icon as any} size={iconSize} color={iconColor} />;
        } else {
            return <FontAwesome5 name={item.icon as any} size={iconSize} color={iconColor} />;
        }
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>
                {/* Background Gradient simulado */}
                <View style={styles.gradientBackground} />
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>Pendências</Text>
                            <Text style={styles.headerSubtitle}>
                                {incompleteTasks.length} {incompleteTasks.length === 1 ? 'item pendente' : 'itens pendentes'}
                            </Text>
                        </View>
                        <View style={styles.headerButtons}>
                            <TouchableOpacity 
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.logoutButton}
                                onPress={async () => {
                                    await removeAuthSession();
                                    navigation.navigate('LoginScreen');
                                }}
                            >
                                <Ionicons name="log-out-outline" size={24} color="#FC7700" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Barra de Progresso */}
                    {/* <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progresso</Text>
                            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                        </View>
                    </View> */}
                </View>

                {/* Lista de Pendências */}
                <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Ilustração quando não há pendências */}
                    {incompleteTasks.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-circle" size={100} color="#27ae60" />
                            <Text style={styles.emptyStateTitle}>Tudo Pronto! 🎉</Text>
                            <Text style={styles.emptyStateDescription}>
                                Você completou todas as pendências. Agora pode usar o app normalmente.
                            </Text>
                            <TouchableOpacity 
                                style={styles.continueButton}
                                onPress={() => navigation.navigate('RolesScreen')}
                            >
                                <Text style={styles.continueButtonText}>Continuar para o App</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Pendências Incompletas */}
                    {incompleteTasks.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ações Necessárias</Text>
                            {incompleteTasks.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.pendingCard,
                                        { marginTop: index === 0 ? 12 : 0 }
                                    ]}
                                    onPress={item.action}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.cardIconContainer}>
                                        {renderIcon(item)}
                                    </View>
                                    <View style={styles.cardContent}>
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.cardTitle}>{item.title}</Text>
                                            {/* <View style={[
                                                styles.priorityBadge,
                                                { backgroundColor: getPriorityColor(item.priority) + '20' }
                                            ]}>
                                                <Text style={[
                                                    styles.priorityText,
                                                    { color: getPriorityColor(item.priority) }
                                                ]}>
                                                    {item.priority === 'high' ? 'Urgente' : item.priority === 'medium' ? 'Importante' : 'Normal'}
                                                </Text>
                                            </View> */}
                                        </View>
                                        <Text style={styles.cardDescription}>{item.description}</Text>
                                    </View>
                                    {/* <Ionicons name="chevron-forward" size={24} color="#666" /> */}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Pendências Completas */}
                    {completeTasks.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Concluídas ✓</Text>
                            {completeTasks.map((item, index) => (
                                <View
                                    key={item.id}
                                    style={[
                                        styles.completedCard,
                                        { marginTop: index === 0 ? 12 : 0 }
                                    ]}
                                >
                                    <View style={styles.cardIconContainer}>
                                        <Ionicons name="checkmark-circle" size={28} color="#27ae60" />
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={styles.completedCardTitle}>{item.title}</Text>
                                        <Text style={styles.completedCardDescription}>Concluído</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </>
    );
}

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: STATUSBAR_HEIGHT,
        backgroundColor: '#FC7700',
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FC7700',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    headerContent: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'flex-start' as const,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    headerButtons: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    progressSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        padding: 16,
    },
    progressHeader: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 12,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: '#fff',
    },
    progressPercentage: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#fff',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden' as const,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: '#fff',
        marginBottom: 4,
    },
    pendingCard: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginRight: 14,
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginBottom: 6,
        gap: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: '#2c3e50',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    priorityText: {
        fontSize: 11,
        fontWeight: '600' as const,
    },
    cardDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
        textAlign: 'justify' as const,
    },
    completedCard: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    completedCardTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#fff',
        marginBottom: 4,
    },
    completedCardDescription: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    emptyState: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 26,
        fontWeight: 'bold' as const,
        color: '#fff',
        marginTop: 24,
        marginBottom: 12,
        textAlign: 'center' as const,
    },
    emptyStateDescription: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center' as const,
        lineHeight: 24,
        marginBottom: 32,
    },
    continueButton: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: '#fff',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 30,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: '#FC7700',
    },
});