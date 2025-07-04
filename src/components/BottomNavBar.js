import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ITEM_WIDTH = 50;
const ITEM_WIDTH_ACTIVE = 70;

export default function BottomNavBar({ items, activeIndex = 0, onSelect }) {
  const [index, setIndex] = useState(activeIndex);

  const handleSelect = (i) => {
    setIndex(i);
    onSelect && onSelect(i);
  };

  const scrollTo = (dir) => {
    handleSelect(dir === 'left' ? Math.max(0, index - 1) : Math.min(items.length - 1, index + 1));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        horizontal
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.key || item.id}
        renderItem={({ item, index: i }) => {
          const isActive = i === index;
          const iconName = isActive ? item.icon : `${item.icon}-outline`;
          return (
            <View style={{ alignItems: 'center' }}>
              {isActive && i > 0 && (
                <TouchableOpacity
                  onPress={() => scrollTo('left')}
                  style={[styles.arrow, styles.leftArrow]}
                >
                  <View style={styles.arrowLeft} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.item,
                  {
                    width: isActive ? ITEM_WIDTH_ACTIVE : ITEM_WIDTH,
                    height: isActive ? ITEM_WIDTH_ACTIVE : ITEM_WIDTH,
                    backgroundColor: isActive ? '#ddd' : 'transparent',
                    borderRadius: 16,
                    marginTop: isActive ? -10 : 0,
                  },
                ]}
                onPress={() => handleSelect(i)}
              >
                <Ionicons
                  name={iconName}
                  size={isActive ? 40 : 24}
                  color="#333"
                />
              </TouchableOpacity>
              {isActive && i < items.length - 1 && (
                <TouchableOpacity
                  onPress={() => scrollTo('right')}
                  style={[styles.arrow, styles.rightArrow]}
                >
                  <View style={styles.arrowRight} />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 10,
  },
  arrow: {
    width: 20,
    height: 20,
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: -25,
    top: '50%',
    marginTop: -10,
  },
  rightArrow: {
    right: -25,
    top: '50%',
    marginTop: -10,
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#333',
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#333',
  },
  list: {
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
