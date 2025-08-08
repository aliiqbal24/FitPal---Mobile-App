import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Ionicons } from '@expo/vector-icons';

export default function ImageViewerModal({ visible, onClose, images, index = 0 }) {
  const imageUrls = images.map(uri => ({ url: uri }));

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <ImageViewer
          imageUrls={imageUrls}
          index={index}
          enableSwipeDown
          onSwipeDown={onClose}
          renderHeader={() => (
            <View style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          saveToLocalByLongPress={false}
        />
      </SafeAreaView>
    </Modal>
  );
}
