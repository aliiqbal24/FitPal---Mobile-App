import React, { useState } from "react";
import { TouchableWithoutFeedback, ImageBackground, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { COMIC_IMAGES } from "../data/comicPages";
import { COMIC_NARRATIONS } from "../data/comicNarrations";
import NarrationBox from "../components/NarrationBox";

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
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <ImageBackground
          source={COMIC_IMAGES[page]}
          style={styles.image}
          resizeMode="cover"
        >
          {COMIC_NARRATIONS[page] && (
            <NarrationBox
              text={COMIC_NARRATIONS[page].text}
              style={[styles.narration, COMIC_NARRATIONS[page].style]}
            />
          )}
        </ImageBackground>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  narration: {
    position: "absolute",
  },
});
