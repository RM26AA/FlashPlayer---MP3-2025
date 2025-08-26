import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function MainScreen({ navigation }) {
  const [playlist, setPlaylist] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPlaylist();
  }, []);

  async function loadPlaylist() {
    const data = await AsyncStorage.getItem("playlist");
    if (data) {
      setPlaylist(JSON.parse(data));
    } else {
      const defaults = [
        {
          id: "1",
          name: "50 Cent",
          uri: require("../assets/music/track1.mp3"),
          date: "Default",
        },
        {
          id: "2",
          name: "Roy Jones Jr",
          uri: require("../assets/music/track2.mp3"),
          date: "Default",
        },
        {
          id: "3",
          name: "Eminem",
          uri: require("../assets/music/track3.mp3"),
          date: "Default",
        },
      ];
      setPlaylist(defaults);
      await AsyncStorage.setItem("playlist", JSON.stringify(defaults));
    }
  }

  async function savePlaylist(newPlaylist) {
    setPlaylist(newPlaylist);
    await AsyncStorage.setItem("playlist", JSON.stringify(newPlaylist));
  }

  async function importFile() {
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (result.type === "success") {
      const newTrack = {
        id: Date.now().toString(),
        name: result.name,
        uri: result.uri,
        date: new Date().toLocaleDateString(),
      };
      const newPlaylist = [...playlist, newTrack];
      savePlaylist(newPlaylist);
    }
  }

  async function resetPlaylist() {
    await AsyncStorage.removeItem("playlist");
    setPlaylist([]);
    loadPlaylist();
  }

  const filteredPlaylist = playlist.filter((track) =>
    track.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.track}
      onPress={() => navigation.navigate("Play", { track: item })}
    >
      <Text style={styles.trackName}>{item.name}</Text>
      <Text style={styles.trackDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.header}>FlashPlayer</Text>

      <TextInput
        style={styles.search}
        placeholder="Search music..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredPlaylist}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }} // extra space for navbar
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={importFile}>
          <MaterialIcons name="file-upload" size={28} color="#fc038c" />
          <Text style={styles.navText}>Import</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Radio")}
        >
          <MaterialIcons name="radio" size={28} color="#fc038c" />
          <Text style={styles.navText}>Radio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={resetPlaylist}>
          <MaterialIcons name="restart-alt" size={28} color="#fc038c" />
          <Text style={styles.navText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fc038c",
    marginBottom: 10,
    textAlign: "center",
  },
  search: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: "#000",
  },
  track: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  trackName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  trackDate: {
    fontSize: 12,
    color: "#888",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  navButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    color: "#fc038c",
    fontSize: 12,
    marginTop: 2,
  },
});



