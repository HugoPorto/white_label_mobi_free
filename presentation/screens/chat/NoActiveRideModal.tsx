import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './NoActiveRideModalStyles';

interface NoActiveRideModalProps {
    visible: boolean;
    onClose: () => void;
    onClosePress?: () => void;
    title: string;
    message: string;
    icon?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryPress?: () => void;
    onSecondaryPress?: () => void;
    type?: 'info' | 'warning' | 'error' | 'success';
}

export const NoActiveRideModal: React.FC<NoActiveRideModalProps> = ({
    visible,
    onClose,
    onClosePress,
    title,
    message,
    icon = "car-outline",
    primaryButtonText = "Entendi",
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    type = 'info',
}) => {
    const scaleAnim = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            scaleAnim.setValue(0);
            fadeAnim.setValue(0);
        }
    }, [visible]);

    const getTypeColors = () => {
        switch (type) {
            case 'error':
                return {
                    primary: '#EF4444',
                    secondary: '#FEE2E2',
                    icon: '#DC2626'
                };
            case 'warning':
                return {
                    primary: '#F59E0B',
                    secondary: '#FEF3C7',
                    icon: '#D97706'
                };
            case 'success':
                return {
                    primary: '#10B981',
                    secondary: '#D1FAE5',
                    icon: '#059669'
                };
            default:
                return {
                    primary: '#3B82F6',
                    secondary: '#DBEAFE',
                    icon: '#2563EB'
                };
        }
    };

    const colors = getTypeColors();

    const handlePrimaryPress = () => {
        if (onPrimaryPress) {
            onPrimaryPress();
        } else {
            onClose();
        }
    };

    const handleSecondaryPress = () => {
        if (onSecondaryPress) {
            onSecondaryPress();
        } else {
            onClose();
        }
    };

    const handleClosePress = () => {
        if (onClosePress) {
            onClosePress();
        } else {
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <Animated.View style={[
                styles.overlay,
                { opacity: fadeAnim }
            ]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.backgroundTouchable}
                    onPress={onClose}
                />
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ scale: scaleAnim }] }
                    ]}
                >
                    {/* Header */}
                    <View style={[
                        styles.header,
                        { backgroundColor: colors.primary }
                    ]}>
                        {/* Decorative background pattern */}
                        <View style={styles.decorativeCircleLarge} />
                        <View style={styles.decorativeCircleSmall} />

                        {/* Icon Circle */}
                        <View style={styles.iconContainer}>
                            <Ionicons name={icon as any} size={36} color="#fff" />
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>
                            {title}
                        </Text>

                        {/* Close button */}
                        <TouchableOpacity
                            onPress={handleClosePress}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.message}>
                            {message}
                        </Text>

                        {/* Buttons */}
                        <View style={styles.buttonsContainer}>
                            {/* Primary Button */}
                            <TouchableOpacity
                                onPress={handlePrimaryPress}
                                activeOpacity={0.8}
                                style={[
                                    styles.primaryButton,
                                    {
                                        backgroundColor: colors.primary,
                                        shadowColor: colors.primary
                                    }
                                ]}
                            >
                                <Text style={styles.primaryButtonText}>
                                    {primaryButtonText}
                                </Text>
                            </TouchableOpacity>

                            {/* Secondary Button */}
                            {secondaryButtonText && (
                                <TouchableOpacity
                                    onPress={handleSecondaryPress}
                                    activeOpacity={0.7}
                                    style={styles.secondaryButton}
                                >
                                    <Text style={[
                                        styles.secondaryButtonText,
                                        { color: colors.primary }
                                    ]}>
                                        {secondaryButtonText}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};
