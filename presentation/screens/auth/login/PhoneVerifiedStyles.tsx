import { Platform, StatusBar, StyleSheet } from "react-native";

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

export const styles = StyleSheet.create({
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
  form: {
    width: '87%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 30,
    marginTop: STATUSBAR_HEIGHT + 20,
    marginBottom: 40,
  },
  formScrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    minHeight: '100%',
  },
  imageUser: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 15
  },
  imageLogo: {
    width: 150,
    alignSelf: 'center',
    marginBottom: 15
  },
  textLogin: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },

  containerTextDontHaveAccount: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  textDontHaveAccount: {
    color: 'white',
    fontSize: 18
  },
  divider: {
    height: 1,
    width: 87,
    backgroundColor: 'white',
    marginHorizontal: 5
  },
  loadingContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 15,
    paddingVertical: 10,
  },
  forgotPasswordText: {
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
    opacity: 0.9,
  },
  privacyLinkButton: {
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 0,
    paddingVertical: 0,
    paddingHorizontal: 15,
  },
  privacyLinkText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Estilos para o Modal de Políticas
  privacyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  privacyModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '85%',
    width: '95%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  privacyModalHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  privacyModalCloseButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 10,
    zIndex: 1,
  },
  privacyModalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FC7700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  privacyModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  privacyModalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  privacyModalScrollContainer: {
    maxHeight: 400,
  },
  privacyModalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  privacyModalText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
    textAlign: 'justify',
  },
  privacyModalFooter: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  privacyModalCloseButtonText: {
    backgroundColor: '#FC7700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  privacyModalCloseButtonTextLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Novos estilos para a tela de verificação de telefone
  phoneVerificationIcon: {
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(252, 119, 0, 0.2)',
    borderRadius: 50,
    padding: 20,
  },
  textSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  textPhoneNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: '#FC7700',
    backgroundColor: 'rgba(252, 119, 0, 0.2)',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  timerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  resendButtonText: {
    color: '#FC7700',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
});

export default styles;