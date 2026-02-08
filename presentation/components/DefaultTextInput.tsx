import { StyleSheet, View, Image, TextInput, KeyboardType, TouchableOpacity } from 'react-native';
import React from 'react';

interface Props {
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    keyboardType?: KeyboardType,
    icon: any,
    secureTextEntry?: boolean,
    textColor?: string,
    placeholderTextColor?: string,
    borderBottomColor?: string,
    isValid?: boolean,
    showValidation?: boolean,
    onFocus?: () => void,
    onBlur?: () => void,
    rightIcon?: any,
    rightIconComponent?: React.ReactNode,
    onRightIconPress?: () => void,
}

const DefaultTextInput = ({
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    icon,
    secureTextEntry = false,
    textColor = 'white',
    placeholderTextColor = 'white',
    borderBottomColor = 'white',
    isValid,
    showValidation = false,
    onFocus,
    onBlur,
    rightIcon,
    rightIconComponent,
    onRightIconPress
}: Props) => {
    
    const getBorderColor = () => {
        if (!showValidation) return borderBottomColor;
        if (value.length === 0) return borderBottomColor;
        return isValid ? '#44cc44' : '#ff4444';
    };

    const hasRightIcon = rightIcon || rightIconComponent;

    return (
        <View style={styles.containerTextInput}>

            <Image
                style={styles.textInputIcon}
                source={icon}
            />

            <TextInput
                style={[
                    styles.textInput, 
                    {
                        color: textColor, 
                        borderBottomColor: getBorderColor(),
                        borderBottomWidth: showValidation && value.length > 0 ? 2 : 1,
                        // Reduz a largura quando há ícone à direita
                        paddingRight: hasRightIcon ? 40 : 0,
                    }
                ]}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                value={value}
                onChangeText={text => onChangeText(text)}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                onFocus={onFocus}
                onBlur={onBlur}
            />

            {hasRightIcon && (
                <TouchableOpacity 
                    onPress={onRightIconPress}
                    style={styles.rightIconContainer}
                    activeOpacity={0.7}
                >
                    {rightIconComponent || (
                        <Image
                            style={styles.rightIcon}
                            source={rightIcon}
                        />
                    )}
                </TouchableOpacity>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    containerTextInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        position: 'relative',
    },
    textInput: {
        flex: 1,
        height: 50,
        borderBottomWidth: 1,
        fontSize: 18,
    },
    textInputIcon: {
        width: 25,
        height: 25,
        marginRight: 15,
    },
    rightIconContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 50,
    },
    rightIcon: {
        width: 20,
        height: 20,
        tintColor: 'white',
    },
})

export default DefaultTextInput;