import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import AvatarWithLevelBadge from '../components/AvatarWithLevelBadge';
import ImageViewerModal from '../components/ImageViewerModal';
import { useCharacter } from '../context/CharacterContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_GALLERY = [];
const INITIAL_PRIVATE = [];
const GALLERY_UPLOAD_LIMIT = 10;
const PRIVATE_UPLOAD_LIMIT = 50;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_WIDTH - 48) / 2;

export default function ProfileScreen() {
  const [tab, setTab] = useState('Gallery');
  const [galleryItems, setGalleryItems] = useState(INITIAL_GALLERY);
  const [privateItems, setPrivateItems] = useState(INITIAL_PRIVATE);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const navigation = useNavigation();
  const { level } = useCharacter();

  const openViewer = index => {
    const items = tab === 'Gallery' ? galleryItems : privateItems;
    const imageIndexes = items
      .map((item, i) => (item.type !== 'video' ? i : null))
      .filter(i => i !== null);
    const imageIndex = imageIndexes.indexOf(index);
    setViewerIndex(imageIndex === -1 ? 0 : imageIndex);
    setViewerVisible(true);
  };

  const closeViewer = () => {
    setViewerVisible(false);
  };

  const handleAddMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required to access media library');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (tab === 'Gallery') {
        if (galleryItems.length >= GALLERY_UPLOAD_LIMIT) {
          alert(`Gallery limit of ${GALLERY_UPLOAD_LIMIT} reached`);
          return;
        }
        setGalleryItems([{ uri: asset.uri, type: asset.type }, ...galleryItems]);
      } else {
        if (privateItems.length >= PRIVATE_UPLOAD_LIMIT) {
          alert(`Private limit of ${PRIVATE_UPLOAD_LIMIT} reached`);
          return;
        }
        setPrivateItems([{ uri: asset.uri, type: asset.type }, ...privateItems]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={32} color="#222" />
        </TouchableOpacity>
        <View style={styles.topBarRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Activity')} style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <AvatarWithLevelBadge
            source={require('../../assets/AppSprite.png')}
            size={72}
            level={level}
          />
          <Text style={styles.username}>vscotest40</Text>
          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Friends')} style={styles.friendsBtn}>
              <Text style={styles.friendsText}>Friends</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setTab('Gallery')} style={[styles.tabBtn, tab === 'Gallery' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'Gallery' && styles.tabTextActive]}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('Private')} style={[styles.tabBtn, tab === 'Private' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'Private' && styles.tabTextActive]}>Private</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plusBtn} onPress={handleAddMedia}>
            <Ionicons name="add-circle" size={36} color="#007AFF" />
          </TouchableOpacity>
        </View>
        {/* Content */}
        {tab === 'Gallery' ? (
          galleryItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Capture your journey with posts, only your friends can see.
              </Text>
            </View>
          ) : (
            <View style={styles.galleryGrid}>
              {galleryItems.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.galleryCard}
                  activeOpacity={0.9}
                  onPress={() => item.type !== 'video' && openViewer(idx)}
                >
                  {item.type === 'video' ? (
                    <Video
                      source={{ uri: typeof item.uri === 'number' ? undefined : item.uri }}
                      style={styles.galleryImg}
                      resizeMode="cover"
                      useNativeControls
                    />
                  ) : (
                    <Image
                      source={typeof item.uri === 'number' ? item.uri : { uri: item.uri }}
                      style={styles.galleryImg}
                      resizeMode="cover"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )
        ) : (
          privateItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Keep track of your progress privately here.</Text>
            </View>
          ) : (
            <View style={styles.galleryGrid}>
              {privateItems.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.galleryCard}
                  activeOpacity={0.9}
                  onPress={() => item.type !== 'video' && openViewer(idx)}
                >
                  {item.type === 'video' ? (
                    <Video
                      source={{ uri: typeof item.uri === 'number' ? undefined : item.uri }}
                      style={styles.galleryImg}
                      resizeMode="cover"
                      useNativeControls
                    />
                  ) : (
                    <Image
                      source={typeof item.uri === 'number' ? item.uri : { uri: item.uri }}
                      style={styles.galleryImg}
                      resizeMode="cover"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )
        )}
      </ScrollView>
      <ImageViewerModal
        visible={viewerVisible}
        onClose={closeViewer}
        images={(tab === 'Gallery' ? galleryItems : privateItems)
          .filter(item => item.type !== 'video')
          .map(item => (typeof item.uri === 'number' ? item.uri : item.uri))}
        index={viewerIndex}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 2, // was 48, increased to move icons lower
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  editText: {
    color: '#222',
    fontWeight: '600',
  },
  shareBtn: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  shareText: {
    color: '#222',
    fontWeight: '600',
  },
  friendsBtn: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  friendsText: {
    color: '#222',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#007AFF',
  },
  plusBtn: {
    marginLeft: 'auto',
    paddingLeft: 12,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  galleryCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  galleryImg: {
    width: '100%',
    height: '100%',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
