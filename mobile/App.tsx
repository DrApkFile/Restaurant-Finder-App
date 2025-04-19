import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

import HomeScreen from "./screens/HomeScreen"
import RestaurantDetailScreen from "./screens/RestaurantDetailScreen"
import { RestaurantProvider } from "./context/RestaurantContext"

export type RootStackParamList = {
  Home: undefined
  RestaurantDetail: { restaurantId: number }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <SafeAreaProvider>
      <RestaurantProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Nearby Restaurants",
                headerStyle: {
                  backgroundColor: "#f4511e",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            />
            <Stack.Screen
              name="RestaurantDetail"
              component={RestaurantDetailScreen}
              options={({ route }) => ({
                title: "Restaurant Details",
                headerStyle: {
                  backgroundColor: "#f4511e",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </RestaurantProvider>
    </SafeAreaProvider>
  )
}
