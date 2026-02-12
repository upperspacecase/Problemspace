"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-client";

interface AppUser {
  _id: string;
  firebaseUid: string;
  displayName: string;
  email: string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: AppUser | null;
  loading: boolean;
  getToken: () => Promise<string | null>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function syncUser(fbUser: FirebaseUser) {
    const token = await fbUser.getIdToken();
    const res = await fetch("/api/auth/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firebaseUid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || "Anonymous",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  }

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await syncUser(fbUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function getToken(): Promise<string | null> {
    if (!firebaseUser) return null;
    return firebaseUser.getIdToken();
  }

  async function loginWithEmail(email: string, password: string) {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signupWithEmail(
    email: string,
    password: string,
    displayName: string
  ) {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await syncUser(cred.user);
  }

  async function loginWithGoogle() {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function logout() {
    const auth = getFirebaseAuth();
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        getToken,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
