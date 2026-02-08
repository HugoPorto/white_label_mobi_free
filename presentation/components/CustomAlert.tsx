import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    buttonText?: string;
}

export default function CustomAlert({ 
    visible, 
    title, 
    message, 
    onClose, 
    buttonText = 'OK' 
}: CustomAlertProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    alertContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        minWidth: 280,
        maxWidth: '90%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#FC7700',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: 'center',
        minWidth: 80,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
