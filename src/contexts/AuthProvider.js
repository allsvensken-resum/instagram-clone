import React, { useEffect, useState, useContext } from 'react';
import { auth } from '../firebase';

const AuthContext = React.createContext();
export const useAuth = () => {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    })

    return unsubscribe;
  }, [])

  const signIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  }

  const signUp = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  const signOut = () => {
    return auth.signOut();
  }

  const value = {
    user,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
