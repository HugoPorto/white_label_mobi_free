import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

interface DrawerMenuButtonProps {
    /**
     * Cor de fundo do botão
     * @default '#4CAF50'
     */
    backgroundColor?: string;

    /**
     * Cor do ícone
     * @default '#FFFFFF'
     */
    iconColor?: string;

    /**
     * Tamanho do ícone
     * @default 28
     */
    iconSize?: number;

    /**
     * Posição top do botão
     * @default 40
     */
    top?: number;

    /**
     * Posição left do botão
     * @default 16
     */
    left?: number;

    /**
     * Posição right do botão (se fornecido, sobrescreve left)
     */
    right?: number;

    /**
     * Posição bottom do botão (se fornecido, sobrescreve top)
     */
    bottom?: number;

    /**
     * Largura do botão
     * @default 50
     */
    width?: number;

    /**
     * Altura do botão
     * @default 50
     */
    height?: number;

    /**
     * zIndex do botão
     * @default 1005
     */
    zIndex?: number;

    /**
     * Estilos adicionais
     */
    style?: StyleProp<ViewStyle>;

    /**
     * Callback customizado ao pressionar (se não fornecido, usa o drawer padrão)
     */
    onPress?: () => void;
}

export const DrawerMenuButton: React.FC<DrawerMenuButtonProps> = ({
    backgroundColor = '#4CAF50',
    iconColor = '#FFFFFF',
    iconSize = 28,
    top = 40,
    left = 16,
    right,
    bottom,
    width = 50,
    height = 50,
    zIndex = 1005,
    style,
    onPress,
}) => {
    const navigation = useNavigation();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            navigation.dispatch(DrawerActions.openDrawer());
        }
    };

    const positionStyle: ViewStyle = {
        position: 'absolute',
        zIndex,
        ...(bottom !== undefined ? { bottom } : { top }),
        ...(right !== undefined ? { right } : { left }),
    };

    return (
        <TouchableOpacity
            style={[
                {
                    backgroundColor,
                    width,
                    height,
                    borderRadius: width / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                },
                positionStyle,
                style,
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Ionicons name="menu" size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
};
