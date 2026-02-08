import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigator/MainStackNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatScreen'>;

interface FloatingChatButtonProps {
  visible?: boolean;
  style?: any;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ 
  visible = true, 
  style 
}) => {
  const navigation = useNavigation<NavigationProp>();

  if (!visible) return null;

  const openChat = () => {
    navigation.navigate('ChatScreen');
  };

  return (
    <TouchableOpacity
      style={[styles.floatingButton, style]}
      onPress={openChat}
      activeOpacity={0.8}
    >
      <Ionicons name="chatbubbles" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 1000,
  },
});

export default FloatingChatButton;
