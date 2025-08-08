import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';

const AuthContext = createContext({
  user: null,
  signIn: async (email, password) => {},
  signUp: async (email, password) => {},
  signOutUser: async () => {},
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [googleRequest, googleResponse, promptGoogle] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    (async () => {
      if (googleResponse?.type === 'success') {
        try {
          const { id_token } = googleResponse.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const cred = await signInWithCredential(auth, credential);
          await saveUserData(cred.user);
        } catch (e) {
          console.log('Google sign in error', e);
        }
      }
    })();
  }, [googleResponse, saveUserData]);

  const saveUserData = useCallback(async user => {
    if (!user) return;
    await setDoc(
      doc(db, 'users', user.uid),
      {
        email: user.email,
        displayName: user.displayName || '',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  }, []);

  const signIn = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await saveUserData(cred.user);
    return cred;
  }, [saveUserData]);

  const signUp = useCallback(async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserData(cred.user);
    return cred;
  }, [saveUserData]);

  const signOutUser = useCallback(() => signOut(auth), []);

  const signInWithGoogle = useCallback(async () => {
    await promptGoogle();
  }, [promptGoogle]);

  const signInWithApple = useCallback(async () => {
    try {
      const appleAuth = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });
      if (!appleAuth.identityToken) return;
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({ idToken: appleAuth.identityToken });
      const cred = await signInWithCredential(auth, credential);
      await saveUserData(cred.user);
    } catch (e) {
      if (e.code !== 'ERR_CANCELED') {
        console.log('Apple sign in error', e);
      }
    }
  }, [saveUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOutUser,
        signInWithGoogle,
        signInWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
