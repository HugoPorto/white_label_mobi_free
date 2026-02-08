import { NavigationContainer } from '@react-navigation/native';
import { MainStackNavigator } from './presentation/navigator/MainStackNavigator';
import { UserRoleProvider } from './presentation/context/UserRoleContext';
import { PermissionsAndroid, Platform } from "react-native";
import { useEffect } from "react";

export default function App() {
  if (typeof window !== 'undefined') {
    (window as any).crypto = {
      getRandomValues: (arr: Uint8Array) => {
        if (arr instanceof Uint8Array) {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
          }
        }
        return arr;
      }
    };
  }

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  async function requestNotificationPermission() {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permissão de notificação concedida");
        } else {
          console.log("Permissão de notificação negada");
        }
      } catch (err) {
        console.warn("Erro ao pedir permissão:", err);
      }
    }
  }

  return (
    <UserRoleProvider>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </UserRoleProvider>
  );
}


