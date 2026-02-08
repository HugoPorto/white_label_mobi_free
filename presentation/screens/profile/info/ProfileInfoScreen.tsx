import { Text, TouchableOpacity, View, Image, ScrollView, StatusBar, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/MainStackNavigator';
import { ProfileStackParamList } from '../../../navigator/ProfileStackNavigator';
import { useNavigation } from '@react-navigation/native';
import styles from './Styles';
import { ProfileUpdateViewModel } from '../update/ProfileUpdateViewModel';
import { container } from '../../../../di/container';
import { useState } from 'react';

interface Props extends StackScreenProps<ProfileStackParamList, 'ProfileInfoScreen'> { };

export default function ProfileInfoScreen({ navigation, route }: Props) {
    const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { authResponse, removeAuthSession } = useAuth();
    const profileViewModel: ProfileUpdateViewModel = container.resolve('profileUpdateViewModel');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAccountDeletionModal, setShowAccountDeletionModal] = useState(false);

    const handleLogout = () => {
        removeAuthSession();
        rootNavigation.replace('SplashScreen');
        setShowLogoutModal(false);
    };

    const handleAccountDeletion = async () => {
        await profileViewModel.createUserDataRequestExclusion(authResponse!.user.id!);
        await removeAuthSession();
        rootNavigation.replace('SplashScreen');
        setShowAccountDeletionModal(false);
    };

    const LogoutButton = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showLogoutModal}
            onRequestClose={() => setShowLogoutModal(false)}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                <View style={{
                    width: '90%',
                    maxWidth: 350,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: 0,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                }}>
                    <View style={{
                        alignItems: 'center',
                        paddingTop: 32,
                        paddingHorizontal: 24,
                        paddingBottom: 20
                    }}>
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: '#FFF3E0',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                            borderWidth: 3,
                            borderColor: '#FF9800'
                        }}>
                            <Ionicons name="log-out" size={36} color="#FF9800" />
                        </View>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: '700',
                            color: '#1a1a1a',
                            textAlign: 'center',
                            marginBottom: 12
                        }}>
                            Sair da Conta?
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#666666',
                            textAlign: 'center',
                            lineHeight: 24,
                            paddingHorizontal: 12
                        }}>
                            Tem certeza que deseja encerrar sua sessão? Você precisará fazer login novamente.
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        borderTopWidth: 1,
                        borderTopColor: '#f0f0f0'
                    }}>
                        <TouchableOpacity
                            onPress={() => setShowLogoutModal(false)}
                            style={{
                                flex: 1,
                                paddingVertical: 18,
                                alignItems: 'center',
                                borderRightWidth: 1,
                                borderRightColor: '#f0f0f0'
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={{
                                fontSize: 17,
                                fontWeight: '600',
                                color: '#666666'
                            }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleLogout}
                            style={{
                                flex: 1,
                                paddingVertical: 18,
                                alignItems: 'center',
                                backgroundColor: '#FF5722',
                                borderBottomRightRadius: 24
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: '#FFFFFF'
                            }}>
                                Sair
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const AccountDeletionButton = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showAccountDeletionModal}
            onRequestClose={() => setShowAccountDeletionModal(false)}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                <View style={{
                    width: '90%',
                    maxWidth: 350,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: 0,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                }}>
                    <View style={{
                        alignItems: 'center',
                        paddingTop: 32,
                        paddingHorizontal: 24,
                        paddingBottom: 20
                    }}>
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: '#FFEBEE',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                            borderWidth: 3,
                            borderColor: '#F44336'
                        }}>
                            <Ionicons name="trash" size={36} color="#F44336" />
                        </View>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: '700',
                            color: '#1a1a1a',
                            textAlign: 'center',
                            marginBottom: 12
                        }}>
                            Encerrar Conta?
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: '#666666',
                            textAlign: 'center',
                            lineHeight: 24,
                            paddingHorizontal: 12
                        }}>
                            Tem certeza que deseja encerrar sua conta? Esta ação é irreversível. Sua conta será encerrada em 15 dias. Até lá, você pode reativá-la entrando em contato com o suporte.
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        borderTopWidth: 1,
                        borderTopColor: '#f0f0f0'
                    }}>
                        <TouchableOpacity
                            onPress={() => setShowAccountDeletionModal(false)}
                            style={{
                                flex: 1,
                                paddingVertical: 18,
                                alignItems: 'center',
                                borderRightWidth: 1,
                                borderRightColor: '#f0f0f0'
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={{
                                fontSize: 17,
                                fontWeight: '600',
                                color: '#666666'
                            }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleAccountDeletion}
                            style={{
                                flex: 1,
                                paddingVertical: 18,
                                alignItems: 'center',
                                backgroundColor: '#F44336',
                                borderBottomRightRadius: 24
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: '#FFFFFF'
                            }}>
                                Encerrar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Header com Gradiente */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerBackground}>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>Meu Perfil</Text>
                            <Text style={styles.headerSubtitle}>
                                Gerencie suas informações pessoais
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {authResponse?.user.image ? (
                                <Image
                                    style={styles.avatar}
                                    source={{ uri: authResponse.user.image }}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="person" size={48} color="#FFFFFF" />
                                </View>
                            )}
                            {/* <View style={styles.statusBadge}>
                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                            </View> */}
                        </View>

                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>
                                {authResponse?.user.name} {authResponse?.user.lastname}
                            </Text>
                            {/* <Text style={styles.userRole}>Motorista Verificado</Text> */}
                        </View>
                    </View>

                    {/* User Details */}
                    <View style={styles.detailsSection}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="mail" size={20} color="#2196F3" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>E-mail</Text>
                                <Text style={styles.detailValue}>{authResponse?.user.email}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="call" size={20} color="#4CAF50" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Telefone</Text>
                                <Text style={styles.detailValue}>{authResponse?.user.phone}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="star" size={20} color="#FF9800" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Avaliação</Text>
                                <View style={styles.ratingContainer}>
                                    <Text style={styles.detailValue}>4.8</Text>
                                    <View style={styles.starsContainer}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Ionicons
                                                key={star}
                                                name={star <= 4 ? "star" : "star-outline"}
                                                size={14}
                                                color="#FF9800"
                                            />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons Premium */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={() => navigation.navigate('ProfileUpdateScreen')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.actionIconContainer}>
                            <Ionicons name="pencil" size={20} color="#FFFFFF" />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Editar Perfil</Text>
                            <Text style={styles.actionSubtitle}>Atualizar informações pessoais</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => rootNavigation.replace('RolesScreen')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="people" size={20} color="#2196F3" />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={[styles.actionTitle, { color: '#1A1A1A' }]}>Funções</Text>
                            <Text style={[styles.actionSubtitle, { color: '#666666' }]}>Gerenciar perfis de acesso</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#666666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={() => setShowLogoutModal(true)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: '#fff4ebff' }]}>
                            <Ionicons name="exit-outline" size={20} color="#f48f36ff" />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={[styles.actionTitle, { color: '#f48f36ff' }]}>Sair da Conta</Text>
                            <Text style={[styles.actionSubtitle, { color: '#666666' }]}>Desconectar do aplicativo</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#f48f36ff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.dangerButton]}
                        onPress={() => setShowAccountDeletionModal(true)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.actionIconContainer, { backgroundColor: '#FFEBEE' }]}>
                            <Ionicons name="trash-outline" size={20} color="#F44336" />
                        </View>
                        <View style={styles.actionTextContainer}>
                            <Text style={[styles.actionTitle, { color: '#F44336' }]}>Encerrar Minha Conta</Text>
                            <Text style={[styles.actionSubtitle, { color: '#666666' }]}>Encerrar definitivamente minha conta no aplicativo</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#F44336" />
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                {/* <View style={styles.statsContainer}>
                    <Text style={styles.statsTitle}>Estatísticas</Text>
                    
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#E8F5E8' }]}>
                                <Ionicons name="car-sport" size={24} color="#4CAF50" />
                            </View>
                            <Text style={styles.statNumber}>127</Text>
                            <Text style={styles.statLabel}>Corridas</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                                <Ionicons name="time" size={24} color="#FF9800" />
                            </View>
                            <Text style={styles.statNumber}>89h</Text>
                            <Text style={styles.statLabel}>Online</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="cash" size={24} color="#2196F3" />
                            </View>
                            <Text style={styles.statNumber}>R$ 2.1k</Text>
                            <Text style={styles.statLabel}>Ganhos</Text>
                        </View>
                    </View>
                </View> */}

                <View style={styles.bottomSpacer} />
            </ScrollView>

            <LogoutButton />
            <AccountDeletionButton />

            <View style={styles.navigationBar} />
        </View>
    );
}