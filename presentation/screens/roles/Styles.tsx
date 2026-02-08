import { Platform, StatusBar, StyleSheet } from "react-native";

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingTop: STATUSBAR_HEIGHT
    },
    imageLogo: {
        width: 150,
        alignSelf: 'center',
        marginTop: 70
    },
    bottomBar: {
        height: 48,
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    roleCard: {
        alignItems: 'center',
        backgroundColor: '#f6f6f6ff',
        borderRadius: 18,
        paddingVertical: 15,
        paddingHorizontal: 24,
        marginVertical: 12,
        marginHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 3
    },
    roleImageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14
    },
    roleImage: {
        width: 88,
        height: 88,
        borderRadius: 44,
        resizeMode: 'cover',
    },
    roleName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    imageBackground: {
        opacity: 0.8,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    logoutButton: {
        position: 'absolute',
        top: STATUSBAR_HEIGHT + 16,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000
    },
});

export default styles;