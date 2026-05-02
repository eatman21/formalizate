import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Supabase profile (has role)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const { data } = await authService.login();
          setProfile(data);
        } catch {
          // 404 means no Supabase profile yet (e.g. mid-registration) — that's OK
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  // Returns the Firebase UserCredential so callers get user.displayName etc.
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  // Called after registration to push profile into context immediately
  const refreshProfile = async () => {
    try {
      const { data } = await authService.login();
      setProfile(data);
      return data;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, register, loginWithGoogle, logout, refreshProfile }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
