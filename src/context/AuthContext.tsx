import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { auth, db } from '../configs/firebase';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        // Fetch user role
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            console.error('User document not found in Firestore');
            setRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Session Timeout Logic (throttled to avoid excessive timer resets)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastActivity = Date.now();
    const THROTTLE_MS = 30000; // Only reset timer every 30s max
    const SESSION_TIMEOUT = 3600000; // 1 hour

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (user) {
        timeoutId = setTimeout(async () => {
          await Swal.fire({
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado por inactividad. Serás redirigido al inicio.',
            icon: 'info',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#f20d0d',
            timer: 5000,
            timerProgressBar: true
          });

          await auth.signOut();
        }, SESSION_TIMEOUT);
      }
    };

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivity > THROTTLE_MS) {
        lastActivity = now;
        resetTimer();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
