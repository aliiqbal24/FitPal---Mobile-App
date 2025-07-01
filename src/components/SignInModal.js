import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const SignInModal = ({ visible, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailAuth = async () => {
    try {
      await signIn(email, password);
      onClose();
    } catch (err) {
      try {
        await signUp(email, password);
        onClose();
      } catch (e) {
        Alert.alert('Auth Error', e.message);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Title */}
          <Text style={styles.title}>Sign In</Text>

          {!showEmail ? (
            <>
              {/* Apple Sign In */}
              <TouchableOpacity style={styles.appleButton} accessibilityRole="button" accessibilityLabel="Sign in with Apple">
                <Ionicons name="logo-apple" size={20} color="#fff" />
                <Text style={styles.appleButtonText}>Sign in with Apple</Text>
              </TouchableOpacity>

              {/* Google Sign In */}
              <TouchableOpacity style={styles.googleButton} accessibilityRole="button" accessibilityLabel="Sign in with Google">
                <Image source={require('../../assets/google-icon.png')} style={styles.icon} />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </TouchableOpacity>

              {/* Email Sign In */}
              <TouchableOpacity style={styles.emailButton} accessibilityRole="button" accessibilityLabel="Continue with email" onPress={() => setShowEmail(true)}>
                <Ionicons name="mail-outline" size={20} color="black" />
                <Text style={styles.emailButtonText}>Continue with email</Text>
              </TouchableOpacity>

              {/* Terms & Policy */}
              <Text style={styles.terms}>
                By continuing you agree to Cal AI's{' '}
                <Text style={styles.link} onPress={() => Linking.openURL('https://yourapp.com/terms')}>
                  Terms and Conditions
                </Text>{' '}
                and{' '}
                <Text style={styles.link} onPress={() => Linking.openURL('https://yourapp.com/privacy')}>
                  Privacy Policy
                </Text>
              </Text>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.modalButton} onPress={handleEmailAuth} accessibilityRole="button" accessibilityLabel="Submit email">
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const DARK_BLUE = '#002F6C';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000040',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 40,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appleButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    marginLeft: 8,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emailButtonText: {
    color: '#000',
    fontSize: 16,
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: DARK_BLUE,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  terms: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  link: {
    color: DARK_BLUE,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default React.memo(SignInModal);
