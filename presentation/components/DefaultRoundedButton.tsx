import { StyleSheet, Text, TouchableOpacity } from "react-native"

interface Props {
    text: string,
    onPress: () => void,
    backgroundColor?: string,
    width?: any, 
    height?: any,
    disabled?: boolean,
}

const DefaultRoundedButton = ({ text, onPress, backgroundColor, width = '100%', height = 55, disabled = false }: Props) => {
    const buttonBackgroundColor = disabled 
        ? '#cccccc' 
        : (backgroundColor || '#FC7700');
    
    return (
        <TouchableOpacity 
            style={[styles.roundedButton, { 
                backgroundColor: buttonBackgroundColor, 
                width: width, 
                height: height,
                opacity: disabled ? 0.6 : 1
            }]}
            onPress={disabled ? undefined : () => onPress()}
            disabled={disabled}
        >
            <Text style={[styles.textButton, { color: disabled ? '#666666' : 'white' }]}>{ text }</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    roundedButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 25
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
})

export default DefaultRoundedButton;