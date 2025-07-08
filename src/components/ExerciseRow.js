import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { getEquipmentImage } from '../data/exerciseEquipmentMap';

export default function ExerciseRow({
  exercise,
  onAddSet,
  onEdit,
  isActive,
  openRef,
  setOpenRef,
  petSprite,
}) {
  const swipeRef = useRef(null);

  const handleOpen = () => {
    if (openRef.current && openRef.current !== swipeRef.current) {
      openRef.current.close();
    }
    setOpenRef(swipeRef.current);
  };

  const handleSwipe = () => {
    onAddSet && onAddSet();
    setTimeout(() => swipeRef.current?.close(), 200);
  };

  const leftActions = () => (
    <View style={styles.leftAction}>
      <Ionicons name="add" size={24} color="#fff" />
    </View>
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={leftActions}
      overshootLeft={false}
      leftThreshold={30}
      onSwipeableWillOpen={handleOpen}
      onSwipeableOpen={handleSwipe}
    >
      <View style={[styles.row, isActive && styles.activeRow]}>
        <Image source={getEquipmentImage(exercise.name)} style={styles.icon} />
        <View style={styles.info}>
          <Text style={styles.name}>{exercise.name}</Text>
          <View style={styles.details}>
            <TouchableOpacity onPress={() => onEdit && onEdit('weight')}>
              <Text style={styles.detail}>Weight: {exercise.weight}kg</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEdit && onEdit('reps')}>
              <Text style={styles.detail}>Reps: {exercise.reps}</Text>
            </TouchableOpacity>
            <Text style={styles.detail}>
              {exercise.completed}/{exercise.sets}
            </Text>
          </View>
        </View>
        {isActive && petSprite && (
          <Image source={petSprite} style={styles.pet} />
        )}
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeRow: {
    borderWidth: 2,
    borderColor: '#1db954',
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detail: {
    color: '#ccc',
    marginRight: 12,
  },
  leftAction: {
    backgroundColor: '#1db954',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    marginVertical: 6,
    borderRadius: 12,
  },
  pet: {
    width: 40,
    height: 40,
  },
});
