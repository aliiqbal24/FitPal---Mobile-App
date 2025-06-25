import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSwipeTabs from '../navigation/useSwipeTabs';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const panHandlers = useSwipeTabs();

  return (
    <ImageBackground
      source={require('../../assets/loading.png')}
      style={styles.container}
      resizeMode="cover"
      {...panHandlers}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeButton} onPress={() => {}}>
            <Ionicons name="close" size={24} color="#888" />
          </TouchableOpacity>
          <Text style={styles.title}>Log in or sign up</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.continueButton} onPress={() => {}}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>
          <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
            <Ionicons name="logo-facebook" size={20} color="#1877F3" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
            <Ionicons name="logo-google" size={20} color="#EA4335" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
            <Ionicons name="logo-apple" size={20} color="#000" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => {}}>
            <Ionicons name="call-outline" size={20} color="#007AFF" style={styles.socialIcon} />
            <Text style={styles.socialText}>Continue with phone</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    width: '100%',
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  card: {
    width: 340,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'stretch',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    color: '#222',
  },
  continueButton: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  orText: {
    marginHorizontal: 8,
    color: '#888',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  socialIcon: {
    marginRight: 12,
  },
  socialText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
}); 