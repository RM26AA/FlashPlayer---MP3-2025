import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RadioScreen({ navigation }) {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const mirrors = [
    "https://all.api.radio-browser.info",
    "https://de1.api.radio-browser.info",
    "https://de2.api.radio-browser.info",
    "https://fi1.api.radio-browser.info",
    "https://nl1.api.radio-browser.info",
  ];

  const fallbackStations = [
    {
      stationuuid: "bbc1",
      name: "BBC Radio 1",
      countrycode: "GB",
      url_resolved: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p",
      favicon: "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/BBC_Radio_1.svg/1200px-BBC_Radio_1.svg.png",
      tags: "pop, chart",
    },
    {
      stationuuid: "capital",
      name: "Capital FM UK",
      countrycode: "GB",
      url_resolved: "http://media-ice.musicradio.com/CapitalMP3",
      favicon: "https://upload.wikimedia.org/wikipedia/en/3/34/Capital_FM_logo.png",
      tags: "pop, hits",
    },
  ];

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    for (let mirror of shuffleArray(mirrors)) {
      try {
        const response = await fetch(`${mirror}/json/stations/bycountrycodeexact/GB`);
        const data = await response.json();
        const validStations = data.filter((station) => station.url_resolved);
        if (validStations.length > 0) {
          const topStations = validStations.slice(0, 50); // Take top 50
          setStations(topStations);
          setFilteredStations(topStations);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log(`Mirror failed: ${mirror}`, error);
      }
    }
    // All mirrors failed
    setStations(fallbackStations);
    setFilteredStations(fallbackStations);
    setLoading(false);
  };

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = stations.filter(
      (station) =>
        station.name.toLowerCase().includes(text.toLowerCase()) ||
        (station.tags && station.tags.toLowerCase().includes(text.toLowerCase()))
    );
    setFilteredStations(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.station}
      onPress={() =>
        navigation.navigate("Play", {
          track: {
            name: item.name,
            uri: { uri: item.url_resolved },
            date: "Live Radio",
          },
        })
      }
    >
      {item.favicon ? (
        <Image source={{ uri: item.favicon }} style={styles.favicon} />
      ) : (
        <View style={[styles.favicon, { backgroundColor: "#fc038c20" }]} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.country}>{item.countrycode}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fc038c" />
        <Text style={{ marginTop: 10, color: "#fc038c" }}>Loading stations...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>UK Radio Stations</Text>

      <TextInput
        style={styles.search}
        placeholder="Search by name or genre..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredStations}
        keyExtractor={(item) => item.stationuuid}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
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
  station: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  favicon: { width: 50, height: 50, borderRadius: 8, marginRight: 15 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  country: { fontSize: 12, color: "#888", marginTop: 2 },
});


