import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PasswordStrengthProps {
    password: string;
    visible: boolean;
}

export default function PasswordStrength({ password, visible }: PasswordStrengthProps) {
    if (!visible || password.length === 0) return null;

    const getStrength = () => {
        if (password.length < 4) return { strength: 1, text: 'Muito fraca', color: '#ff4444' };
        if (password.length < 6) return { strength: 2, text: 'Fraca', color: '#ff8800' };
        if (password.length < 8) return { strength: 3, text: 'Média', color: '#ffaa00' };
        return { strength: 4, text: 'Forte', color: '#44cc44' };
    };

    const { strength, text, color } = getStrength();

    return (
        <View style={styles.container}>
            <View style={styles.strengthBar}>
                {[1, 2, 3, 4].map((level) => (
                    <View
                        key={level}
                        style={[
                            styles.strengthSegment,
                            {
                                backgroundColor: level <= strength ? color : 'rgba(255, 255, 255, 0.3)',
                            }
                        ]}
                    />
                ))}
            </View>
            <Text style={[styles.strengthText, { color }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginLeft: 40, // Alinha com o texto do input
    },
    strengthBar: {
        flexDirection: 'row',
        height: 4,
        marginBottom: 5,
    },
    strengthSegment: {
        flex: 1,
        marginRight: 2,
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '500',
    },
});
