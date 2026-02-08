import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface CustomModalProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    buttons?: Array<{
        text: string;
        onPress: () => void;
        style?: 'default' | 'cancel' | 'destructive';
    }>;
    onClose?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    title,
    message,
    type = 'info',
    buttons = [{ text: 'OK', onPress: () => {}, style: 'default' }],
    onClose,
}) => {
    const [animation] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (visible) {
            Animated.spring(animation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, animation]);

    const getTypeStyle = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: '#4CAF50',
                    icon: '✅',
                };
            case 'error':
                return {
                    backgroundColor: '#f44336',
                    icon: '❌',
                };
            case 'warning':
                return {
                    backgroundColor: '#ff9800',
                    icon: '⚠️',
                };
            default:
                return {
                    backgroundColor: '#2196F3',
                    icon: 'ℹ️',
                };
        }
    };

    const typeStyle = getTypeStyle();

    const scale = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
    });

    const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const handleButtonPress = (buttonAction: () => void) => {
        buttonAction();
        if (onClose) {
            onClose();
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ scale }],
                            opacity,
                        },
                    ]}
                >
                    {/* Header com ícone e cor do tipo */}
                    <View style={[styles.header, { backgroundColor: typeStyle.backgroundColor }]}>
                        <Text style={styles.icon}>{typeStyle.icon}</Text>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    {/* Conteúdo */}
                    <View style={styles.content}>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    {/* Botões */}
                    <View style={styles.buttonContainer}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    button.style === 'cancel' && styles.cancelButton,
                                    button.style === 'destructive' && styles.destructiveButton,
                                    buttons.length === 1 && styles.singleButton,
                                    index === 0 && buttons.length > 1 && styles.firstButton,
                                    index === buttons.length - 1 && buttons.length > 1 && styles.lastButton,
                                ]}
                                onPress={() => handleButtonPress(button.onPress)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        button.style === 'cancel' && styles.cancelButtonText,
                                        button.style === 'destructive' && styles.destructiveButtonText,
                                    ]}
                                >
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: width * 0.85,
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    icon: {
        fontSize: 24,
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    singleButton: {
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    firstButton: {
        borderRightWidth: 0.5,
        borderRightColor: '#e0e0e0',
        borderBottomLeftRadius: 16,
    },
    lastButton: {
        borderLeftWidth: 0.5,
        borderLeftColor: '#e0e0e0',
        borderBottomRightRadius: 16,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    destructiveButton: {
        backgroundColor: '#ffebee',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    cancelButtonText: {
        color: '#666',
    },
    destructiveButtonText: {
        color: '#f44336',
    },
});

export default CustomModal;
