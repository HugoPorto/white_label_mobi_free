import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { DriverTripMapScreen } from "../screens/driver/tripMap/DriverTripMapScreen";
import { ClientRequestResponse } from "../../domain/models/ClientRequestResponse";
import { DriverTripRatingScreen } from "../screens/driver/tripRating/DriverTripRatingScreen";

export type DriverMapStackParamList = {
    DriverTripMapScreen: {idClientRequest: number},
    DriverTripRatingScreen: {clientRequest: ClientRequestResponse},
}

const Stack = createNativeStackNavigator<DriverMapStackParamList>();

export const DriverMapStackNavigator = () => {

    return (
        <Stack.Navigator>

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="DriverTripMapScreen"
                component={DriverTripMapScreen}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="DriverTripRatingScreen"
                component={DriverTripRatingScreen}
            />

        </Stack.Navigator>
        
    )

}
