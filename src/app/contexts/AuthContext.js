'use client';
{/**app/contexts/authcontext.js */}
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('guest');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Get or create user in MongoDB
          const userData = await getUserData(firebaseUser);
          setUser(firebaseUser);
          setUserRole(userData.role);
          setUserData(userData);
        } catch (error) {
          console.error('Error getting user data:', error);
          setUser(firebaseUser);
          setUserRole('student'); // Default role
        }
      } else {
        // User is signed out
        setUser(null);
        setUserRole('guest');
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getUserData = async (firebaseUser) => {
    try {
      // Check if user exists in MongoDB
      const response = await fetch(`/api/users/${firebaseUser.uid}`);
      
      if (response.ok) {
        const userData = await response.json();
        
        // Check for automatic role upgrade
        if (userData.role === 'student' && userData.loginCount >= 10 && userData.examProgress.totalExams >= 5) {
          // Upgrade to advanced
          const upgradeResponse = await fetch(`/api/users/${firebaseUser.uid}/upgrade`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              reason: 'automatic_upgrade',
              criteria: 'login_count_and_exam_progress'
            }),
          });
          
          if (upgradeResponse.ok) {
            const upgradedUser = await upgradeResponse.json();
            return upgradedUser;
          }
        }
        
        // Update login count and last login
        await updateUserLogin(firebaseUser.uid);
        return userData;
      } else {
        // Create new user
        const newUser = await createUser(firebaseUser);
        return newUser;
      }
    } catch (error) {
      console.error('Error in getUserData:', error);
      throw error;
    }
  };

  const createUser = async (firebaseUser) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'student' // Default role
        }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUserLogin = async (uid) => {
    try {
      await fetch(`/api/users/${uid}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error updating user login:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Role-based permission checks
  const hasPermission = (permission) => {
    if (!userData) return false;
    return userData.permissions?.[permission] || false;
  };

  const canAccessRoute = (route) => {
    if (!userData) return route === '/';
    
    const routePermissions = {
      '/student': ['student', 'advanced', 'admin'],
      '/advanced': ['advanced', 'admin'],
      '/admin': ['admin']
    };
    
    return routePermissions[route] ? routePermissions[route].includes(userData.role) : true;
  };

  const isRole = (role) => {
    return userData?.role === role;
  };

  const isAtLeastRole = (role) => {
    const roleHierarchy = {
      'guest': 0,
      'student': 1,
      'advanced': 2,
      'admin': 3
    };
    
    const userLevel = roleHierarchy[userData?.role] || 0;
    const requiredLevel = roleHierarchy[role] || 0;
    
    return userLevel >= requiredLevel;
  };

  const value = {
    user,
    userRole,
    userData,
    signInWithGoogle,
    logout,
    loading,
    hasPermission,
    canAccessRoute,
    isRole,
    isAtLeastRole,
    refreshUserData: () => getUserData(user)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 