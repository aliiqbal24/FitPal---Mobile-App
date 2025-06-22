import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Image, Dimensions, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const stories = [
  { name: 'Alex' },
  { name: 'Jamie' },
  { name: 'Taylor' },
  { name: 'Jordan' },
  { name: 'Morgan' },
  { name: 'Casey' },
  { name: 'Riley' },
  { name: 'Sam' },
];

const posts = [
  { name: 'Chris', image: require('../explore_bg.png') },
  { name: 'Pat', image: require('../explore_bg.png') },
  { name: 'Drew', image: require('../explore_bg.png') },
  { name: 'Sky', image: require('../explore_bg.png') },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT / 2.2; // 2 cards fit at once, with padding

export default function ExploreScreen() {
  const [liked, setLiked] = useState([false, false, false, false]);
  const [fullImage, setFullImage] = useState(null);

  const toggleLike = idx => {
    setLiked(liked => liked.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <ImageBackground
      source={require('../explore_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.storiesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          >
            {stories.map((story, idx) => (
              <View key={idx} style={styles.storyItem}>
                <View style={styles.storyCircle} />
                <Text style={styles.storyName}>{story.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.postsContainer}>
          {posts.map((post, idx) => (
            <View key={idx} style={styles.postCard}>
              <TouchableOpacity onPress={() => setFullImage(post.image)}>
                <Image source={post.image} style={styles.postImage} resizeMode="cover" />
              </TouchableOpacity>
              <View style={styles.postFooter}>
                <Text style={styles.postName}>{post.name}</Text>
                <TouchableOpacity style={styles.heartButton} onPress={() => toggleLike(idx)}>
                  <Ionicons name={liked[idx] ? 'heart' : 'heart-outline'} size={26} color={liked[idx] ? '#E74C3C' : '#E74C3C'} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal visible={!!fullImage} transparent onRequestClose={() => setFullImage(null)}>
        <Pressable style={styles.fullscreenContainer} onPress={() => setFullImage(null)}>
          {fullImage && (
            <Image source={fullImage} style={styles.fullscreenImage} resizeMode="contain" />
          )}
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

const STORY_SIZE = 68 * 1.25; // 25% bigger
const STORY_MARGIN = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  storiesContainer: {
    marginTop: 48,
    paddingLeft: 20,
    marginBottom: 24,
  },
  storiesScroll: {
    alignItems: 'center',
    paddingRight: 20,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: STORY_MARGIN,
    width: STORY_SIZE,
  },
  storyCircle: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    backgroundColor: '#fff', // placeholder color
    borderWidth: 3,
    borderColor: '#007AFF',
    marginBottom: 6,
  },
  storyName: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    width: STORY_SIZE,
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 18,
    marginBottom: 24,
    overflow: 'hidden',
    height: CARD_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: 'flex-end',
  },
  postImage: {
    width: '100%',
    height: '75%',
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  postName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  heartButton: {
    padding: 6,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});
