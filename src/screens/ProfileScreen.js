import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import AvatarWithLevelBadge from '../components/AvatarWithLevelBadge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const GALLERY_IMAGES = [
  require('../explore_bg.png'),
  require('../explore_bg.png'),
  require('../explore_bg.png'),
  require('../explore_bg.png'),
  require('../explore_bg.png'),
  require('../explore_bg.png'),
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_WIDTH - 48) / 2;

export default function ProfileScreen() {
  const [tab, setTab] = useState('Gallery');
  const navigation = useNavigation();

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
            level={1}
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
          <TouchableOpacity onPress={() => setTab('Collection')} style={[styles.tabBtn, tab === 'Collection' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'Collection' && styles.tabTextActive]}>Collection</Text>
          </TouchableOpacity>
          {tab === 'Collection' && (
            <TouchableOpacity style={styles.plusBtn}>
              <Ionicons name="add-circle" size={36} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>
        {/* Content */}
        {tab === 'Gallery' ? (
          <View style={styles.galleryGrid}>
            {GALLERY_IMAGES.map((img, idx) => (
              <View key={idx} style={styles.galleryCard}>
                <Image source={img} style={styles.galleryImg} resizeMode="cover" />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.collectionContent}>
            {/* Placeholder for collection cards */}
            <Text style={styles.collectionPlaceholder}>Your collection is empty.</Text>
          </View>
        )}
      </ScrollView>
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
  collectionContent: {
    alignItems: 'center',
    padding: 32,
  },
  collectionPlaceholder: {
    color: '#888',
    fontSize: 16,
    marginTop: 24,
  },
});