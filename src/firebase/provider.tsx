'use client';

import React, { useMemo, type ReactNode } from 'react';
import { initializeFirebase, FirebaseContext } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp: firebaseServices.firebaseApp,
        auth: firebaseServices.auth,
        firestore: firebaseServices.firestore,
      }}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}
