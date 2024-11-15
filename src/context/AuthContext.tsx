import React, { createContext, useState, useEffect } from "react";
import { auth } from "../firebase.js";
import {
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";

interface AuthContextProps {
  user: User | null;
  signin: () => void;
  signout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  signin: () => {},
  signout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signin = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
