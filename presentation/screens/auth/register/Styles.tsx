import { Platform, StatusBar, StyleSheet } from "react-native";

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    imageBackground: {
        opacity: 0.6,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        minHeight: '100%',
    },
    form: {
        width: '87%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 30,
        marginTop: STATUSBAR_HEIGHT + 20,
        marginBottom: 40,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    back: {
        width: 25,
        height: 25,
        tintColor: 'white',
    },
    imageUser: {
        width: 60,
        height: 60,
        alignSelf: 'center',
        marginBottom: 10,
    },
    imageLogo: {
        width: 150,
        height: 40,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    textRegister: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    textSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        alignSelf: 'center',
        marginBottom: 25,
        textAlign: 'center',
    },
    inputsContainer: {
        marginBottom: 20,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 2,
        marginLeft: 40,
        fontWeight: '500',
    },
    showPasswordText: {
        fontSize: 18,
        color: 'white',
    },
    loginLink: {
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 10,
    },
    loginLinkText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
    },
    loginLinkTextBold: {
        fontWeight: 'bold',
        color: 'white',
        textDecorationLine: 'underline',
    },
    privacyLinkButton: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 15,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    privacyLinkText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11,
        textDecorationLine: 'underline',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default styles;