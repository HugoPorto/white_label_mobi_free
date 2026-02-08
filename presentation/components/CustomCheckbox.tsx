import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface CustomCheckboxProps {
    isChecked: boolean;
    onToggle: () => void;
    label: string;
    disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ 
    isChecked, 
    onToggle, 
    label, 
    disabled = false 
}) => {
    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={disabled ? undefined : onToggle}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <View style={[
                styles.checkbox, 
                isChecked && styles.checkboxChecked,
                disabled && styles.checkboxDisabled
            ]}>
                {isChecked && (
                    <Text style={styles.checkboxIcon}>✓</Text>
                )}
            </View>
            <Text style={[
                styles.label,
                disabled && styles.labelDisabled
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
        paddingHorizontal: 5,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        backgroundColor: 'transparent',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: 'white',
        borderColor: 'white',
    },
    checkboxDisabled: {
        opacity: 0.5,
    },
    checkboxIcon: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
    label: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    labelDisabled: {
        opacity: 0.5,
    },
});

export default CustomCheckbox;
