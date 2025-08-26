import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/SplashScreen";
import MainScreen from "./screens/MainScreen";
import PlayScreen from "./screens/PlayScreen";
import RadioScreen from "./screens/RadioScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Play" component={PlayScreen} />
        <Stack.Screen name="Radio" component={RadioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
