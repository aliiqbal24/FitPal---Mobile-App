import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import SignInModal from '../components/SignInModal';

const OnboardingScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRightLang}>
        <Text style={styles.language}>🇺🇸 EN</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>A stronger you, the fun way</Text>
      </View>
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate('Gender')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Text style={styles.signInText}>
        Already have an account?{' '}
        <Text style={styles.signInLink} onPress={() => setModalVisible(true)}>
          Sign In
        </Text>
      </Text>
      <SignInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const DARK_BLUE = '#002F6C';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  topRightLang: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  language: {
    fontSize: 14,
    color: '#000',
  },
  textContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  getStartedButton: {
    backgroundColor: DARK_BLUE,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 80,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#000',
  },
  signInLink: {
    fontWeight: '600',
    color: DARK_BLUE,
  },
});

export default OnboardingScreen;
