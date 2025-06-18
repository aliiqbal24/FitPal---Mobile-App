import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileModal({ isVisible, onClose }) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/AppSprite.png')} style={styles.avatarImage} />
          </View>

          {/* User Info */}
          <Text style={styles.username}>Gym Rat</Text>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level 1</Text>
            <View style={styles.xpBar}>
              <View style={[styles.xpProgress, { width: '25%' }]} />
            </View>
            <Text style={styles.xpText}>250/1000 XP</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="barbell" size={24} color="#666" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Lifts</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={24} color="#666" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>PRs</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={24} color="#666" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  levelText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
}); 