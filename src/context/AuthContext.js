import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const AuthContext = createContext({
  user: null,
  signIn: async (email, password) => {},
  signUp: async (email, password) => {},
  signOutUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  const signIn = useCallback((email, password) => signInWithEmailAndPassword(auth, email, password), []);

  const signUp = useCallback((email, password) => createUserWithEmailAndPassword(auth, email, password), []);

  const signOutUser = useCallback(() => signOut(auth), []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
