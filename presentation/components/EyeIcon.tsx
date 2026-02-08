import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface EyeIconProps {
    isVisible: boolean;
    color?: string;
    size?: number;
}

export default function EyeIcon({ isVisible, color = 'white', size = 18 }: EyeIconProps) {
    return (
        <Text style={[styles.eyeIcon, { color, fontSize: size }]}>
            {isVisible ? '👁️' : '🙈'}
        </Text>
    );
}

const styles = StyleSheet.create({
    eyeIcon: {
        textAlign: 'center',
    },
});
