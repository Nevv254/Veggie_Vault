import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');

    // Fallback timeout to ensure loading doesn't hang forever
    const fallbackTimeout = setTimeout(() => {
      console.log('Fallback timeout reached, setting loading to false');
      setLoading(false);
    }, 10000); // 10 seconds fallback

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      try {
        if (user) {
          console.log('User authenticated:', user.email);
          setUser(user);
          // Get user role from Firestore with timeout
          try {
            console.log('Fetching user role from Firestore...');
            const userDocPromise = getDoc(doc(db, 'users', user.uid));
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Firestore timeout')), 5000)
            );

            const userDoc = await Promise.race([userDocPromise, timeoutPromise]);
            console.log('Firestore query completed');

            if (userDoc.exists()) {
              const role = userDoc.data().role;
              console.log('User role found:', role);
              setUserRole(role);
            } else {
              console.log('No user document found in Firestore');
              setUserRole(null);
            }
          } catch (firestoreError) {
            console.warn('Error fetching user role from Firestore:', firestoreError);
            setUserRole(null);
          }
        } else {
          console.log('No authenticated user');
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setUserRole(null);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
        clearTimeout(fallbackTimeout); // Clear the fallback timeout
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserRole = async (newRole) => {
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: newRole,
          createdAt: new Date()
        }, { merge: true });
        setUserRole(newRole);
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    }
  };

  const value = {
    user,
    userRole,
    loading,
    logout,
    updateUserRole
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};