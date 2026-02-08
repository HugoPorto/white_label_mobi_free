import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    ActivityIndicator,
} from 'react-native';

const { width } = Dimensions.get('window');

interface LoadingModalProps {
    visible: boolean;
    message?: string;
    type?: 'loading' | 'success' | 'error';
}

const LoadingModal: React.FC<LoadingModalProps> = ({
    visible,
    message = 'Carregando...',
    type = 'loading',
}) => {
    const [spinValue] = React.useState(new Animated.Value(0));
    const [fadeValue] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (visible) {
            // Fade in
            Animated.timing(fadeValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            if (type === 'loading') {
                // Spin animation
                const spin = () => {
                    spinValue.setValue(0);
                    Animated.timing(spinValue, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }).start(() => {
                        if (visible && type === 'loading') {
                            spin();
                        }
                    });
                };
                spin();
            }
        } else {
            // Fade out
            Animated.timing(fadeValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, type, spinValue, fadeValue]);

    const spinInterpolate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const renderIcon = () => {
        switch (type) {
            case 'success':
                return <Text style={styles.successIcon}>✅</Text>;
            case 'error':
                return <Text style={styles.errorIcon}>❌</Text>;
            case 'loading':
            default:
                return (
                    <Animated.View
                        style={[
                            styles.spinnerContainer,
                            { transform: [{ rotate: spinInterpolate }] },
                        ]}
                    >
                        <ActivityIndicator size="large" color="#007AFF" />
                    </Animated.View>
                );
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
        >
            <Animated.View
                style={[styles.overlay, { opacity: fadeValue }]}
            >
                <View style={styles.modalContainer}>
                    {renderIcon()}
                    <Text style={styles.message}>{message}</Text>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 32,
        paddingVertical: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 16,
        minWidth: width * 0.6,
        maxWidth: width * 0.8,
    },
    spinnerContainer: {
        marginBottom: 16,
    },
    successIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default LoadingModal;
