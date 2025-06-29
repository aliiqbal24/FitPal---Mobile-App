import React, { useState } from "react";
import { TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { COMIC_IMAGES } from "../data/comicPages";

export default function ComicScreen({ navigation }) {
  const [page, setPage] = useState(0);

  const handlePress = async () => {
    if (page < COMIC_IMAGES.length - 1) {
      setPage(page + 1);
    } else {
      await AsyncStorage.setItem("hasSeenComic", "true");
      navigation.replace("Tabs", { screen: "Gym" });
    }
  };

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={styles.container}
      onTouchEnd={handlePress}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={handlePress}
      >
        <ImageBackground
          source={COMIC_IMAGES[page]}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
