import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CharacterCustomizationTopBar from '../components/CharacterCustomizationTopBar';
import CharacterStage from '../components/CharacterStage';
import EvolutionTimeline from '../components/EvolutionTimeline';
import OutfitCloset from '../components/OutfitCloset';
import CustomizationBottomTabs from '../components/CustomizationBottomTabs';
import CircularCharacterGallery from '../components/CircularCharacterGallery';

export default function CharacterCustomizationScreen() {
  const [bottomTab, setBottomTab] = useState('Outfits');
  const [closetTab, setClosetTab] = useState('Hats');
  const [character, setCharacter] = useState('Gorilla1');

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <CharacterCustomizationTopBar level={3} coins={120} gems={5} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <CharacterStage character={character} />
        <CircularCharacterGallery onSelect={setCharacter} />
        <EvolutionTimeline currentLevel={3} />
        {bottomTab === 'Outfits' && (
          <OutfitCloset tab={closetTab} onTabChange={setClosetTab} />
        )}
        {/* Legacy roster kept for reference */}
        {/* <CharacterRoster unlocked={1} /> */}
      </ScrollView>
      <CustomizationBottomTabs tab={bottomTab} onTabChange={setBottomTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  scroll: {
    paddingBottom: 80,
  },
});
