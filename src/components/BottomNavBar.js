import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ITEM_WIDTH = 36;         // or keep as before if you want
const ITEM_WIDTH_ACTIVE = 60;  // or keep as before if you want

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
      <TouchableOpacity onPress={() => scrollTo('left')} style={styles.arrow}>
        <View style={styles.arrowLeft} />
      </TouchableOpacity>
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
            <TouchableOpacity
              style={[
                styles.item,
                {
                  width: isActive ? ITEM_WIDTH_ACTIVE : ITEM_WIDTH,
                  height: isActive ? ITEM_WIDTH_ACTIVE : ITEM_WIDTH,
                  backgroundColor: isActive ? '#ddd' : 'transparent',
                  borderRadius: 16,
                },
              ]}
              onPress={() => handleSelect(i)}
            >
              <Ionicons
                name={iconName}
                size={isActive ? 40 : 24} // <-- restore to original sizes
                color="#333"
              />
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity onPress={() => scrollTo('right')} style={styles.arrow}>
        <View style={styles.arrowRight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60, // shorter bar
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 10,
  },
  arrow: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
