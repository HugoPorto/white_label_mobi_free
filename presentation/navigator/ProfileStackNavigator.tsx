import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileInfoScreen from "../screens/profile/info/ProfileInfoScreen";
import ProfileUpdateScreen from "../screens/profile/update/ProfileUpdateScreen";

export type ProfileStackParamList = {
    ProfileInfoScreen: undefined,
    ProfileUpdateScreen: undefined,
}

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = () => {

    return (
        <Stack.Navigator>

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="ProfileInfoScreen"
                component={ProfileInfoScreen}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="ProfileUpdateScreen"
                component={ProfileUpdateScreen}
            />

        </Stack.Navigator>
        
    )

}
