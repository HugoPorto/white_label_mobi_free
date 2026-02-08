import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './MapThemeModalStyles';

interface MapThemeModalProps {
    visible: boolean;
    onClose: () => void;
    currentTheme: 'orange' | 'dark';
    onThemeSelect: (theme: 'orange' | 'dark') => void;
}

export default function MapThemeModal({
    visible,
    onClose,
    currentTheme,
    onThemeSelect
}: MapThemeModalProps) {
    const handleThemeSelect = (theme: 'orange' | 'dark') => {
        onThemeSelect(theme);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header do Modal */}
                    <View style={styles.modalHeader}>
                        <View style={styles.modalIconContainer}>
                            <Ionicons name="map" size={24} color="#fff" />
                        </View>
                        <Text style={styles.modalTitle}>
                            Tema do Mapa
                        </Text>
                        <Text style={styles.modalSubtitle}>
                            Escolha o visual que preferir
                        </Text>
                    </View>

                    {/* Opções de Tema */}
                    <View style={styles.themesContainer}>
                        {/* Tema Laranja (Padrão) */}
                        <TouchableOpacity
                            onPress={() => handleThemeSelect('orange')}
                            style={[
                                styles.themeButton,
                                currentTheme === 'orange' ? styles.themeButtonActive : styles.themeButtonInactive
                            ]}
                        >
                            <View style={[styles.themeIconContainer, styles.themeIconOrange]}>
                                <Ionicons name="sunny" size={20} color="#fff" />
                            </View>
                            <View style={styles.themeTextContainer}>
                                <Text style={styles.themeTitle}>
                                    Laranja
                                </Text>
                                <Text style={styles.themeDescription}>
                                    Tema quente (padrão)
                                </Text>
                            </View>
                            {currentTheme === 'orange' && (
                                <Ionicons name="checkmark-circle" size={24} color="#FF9800" />
                            )}
                        </TouchableOpacity>

                        {/* Tema Escuro */}
                        <TouchableOpacity
                            onPress={() => handleThemeSelect('dark')}
                            style={[
                                styles.themeButton,
                                currentTheme === 'dark' ? styles.themeButtonActiveDark : styles.themeButtonInactive
                            ]}
                        >
                            <View style={[styles.themeIconContainer, styles.themeIconDark]}>
                                <Ionicons name="moon" size={20} color="#fff" />
                            </View>
                            <View style={styles.themeTextContainer}>
                                <Text style={styles.themeTitle}>
                                    Escuro
                                </Text>
                                <Text style={styles.themeDescription}>
                                    Ideal para uso noturno
                                </Text>
                            </View>
                            {currentTheme === 'dark' && (
                                <Ionicons name="checkmark-circle" size={24} color="#424242" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Botão Cancelar */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.cancelButton}
                    >
                        <Text style={styles.cancelButtonText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
