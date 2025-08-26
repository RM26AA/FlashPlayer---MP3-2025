import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity animation
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // zoom animation

  useEffect(() => {
    // Start animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 2.5s
    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/flash_player_1.png")}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      />
      <Animated.Text
        style={[
          styles.title,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // white background
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    color: "#e63946", // pink/red theme
    fontWeight: "bold",
  },
});


