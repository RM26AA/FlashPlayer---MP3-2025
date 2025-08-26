import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from "react-native";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { MotiView } from "moti";

const screenWidth = Dimensions.get("window").width;

export default function PlayScreen({ route }) {
  const { track } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: position / duration,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [position, duration]);

  async function loadSound() {
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync(track.uri, {
      shouldPlay: true,
    });
    setSound(newSound);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
        setIsPlaying(status.isPlaying);
      }
    });
  }

  async function playPause() {
    if (!sound) return loadSound();
    if (isPlaying) await sound.pauseAsync();
    else await sound.playAsync();
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      setPosition(0);
      setIsPlaying(false);
    }
  }

  async function rewindSound() {
    if (sound) {
      let newPos = Math.max(position - 10000, 0);
      await sound.setPositionAsync(newPos);
    }
  }

  async function forwardSound() {
    if (sound) {
      let newPos = Math.min(position + 10000, duration);
      await sound.setPositionAsync(newPos);
    }
  }

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenWidth - 40],
  });

  const AnimatedButton = ({ children, onPress }) => {
    const scale = new Animated.Value(1);
    return (
      <TouchableWithoutFeedback
        onPressIn={() =>
          Animated.spring(scale, { toValue: 1.2, useNativeDriver: true }).start()
        }
        onPressOut={() => {
          Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
          onPress();
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title Box */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>{track.name}</Text>
      </View>

      {/* Album Art */}
      <MotiView
        from={{ scale: 0.8, rotate: "0deg" }}
        animate={{ scale: 1, rotate: "360deg" }}
        transition={{ type: "spring", duration: 2000 }}
        style={styles.albumContainer}
      >
        <Image
          source={require("../assets/rec2.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </MotiView>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>

      {/* Top Controls: Rewind - Play - Forward */}
      <View style={styles.topControls}>
        <AnimatedButton onPress={rewindSound}>
          <MaterialIcons name="replay-10" size={50} color="#fc038c" />
        </AnimatedButton>

        <AnimatedButton onPress={playPause}>
          <MaterialIcons
            name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
            size={70}
            color="#fc038c"
          />
        </AnimatedButton>

        <AnimatedButton onPress={forwardSound}>
          <MaterialIcons name="forward-10" size={50} color="#fc038c" />
        </AnimatedButton>
      </View>

      {/* Stop Button Below Play */}
      <View style={styles.bottomControl}>
        <AnimatedButton onPress={stopSound}>
          <MaterialIcons name="stop-circle" size={50} color="#fc038c" />
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  titleBox: {
    marginTop: 20,
    backgroundColor: "#fc038c20",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fc038c",
    textAlign: "center",
  },
  albumContainer: {
    marginTop: 40,
    marginBottom: 30,
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginHorizontal: 10,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#fc038c",
    borderRadius: 3,
  },
  time: {
    width: 40,
    textAlign: "center",
    color: "#555",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  bottomControl: {
    justifyContent: "center",
    alignItems: "center",
  },
});


