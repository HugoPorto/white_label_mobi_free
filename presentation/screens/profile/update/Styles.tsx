import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    boxBackground: {
        width: '100%',
        height: 300,
        backgroundColor: '#FC7700',
        alignItems: 'center'
    },
    textBox: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 19,
        marginTop: 40
    },
    cardUserInfo: {
        backgroundColor: 'white',
        position: 'absolute',
        width: '80%',
        height: '45%',
        top: 100,
        borderRadius: 15,
        alignSelf: 'center',
        elevation: 2
    },
    imageUser: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 30
    },
    textUsername: {
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 25
    },
    textEmail: {
        alignSelf: 'center'
    },
    textPhone: {
        alignSelf: 'center'
    },
    viewActions: {
        position: 'absolute',
        bottom: 60
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 25,
        marginTop: 15
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: '#FC7700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textAction: {
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 10
    }
});

export default styles;