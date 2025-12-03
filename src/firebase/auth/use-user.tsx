'use client';

import { useState, useEffect } from 'react';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider'; // Assuming useAuth is exported from provider

/**
 * Interface for the return value of the useUser hook.
 */
export interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook to get the current authenticated user from Firebase.
 *
 * This hook subscribes to Firebase's authentication state changes. It provides
 * the user object, a loading state, and any potential errors during the
 * authentication process.
 *
 * @returns {UseUserResult} An object containing the user, loading state, and error.
 */
export function useUser(): UseUserResult {
  const auth = useAuth(); // Get the auth instance from the context.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If there's no auth instance, we can't determine the user.
    if (!auth) {
      setIsLoading(false);
      // Optionally set an error if auth is expected but not available.
      // setError(new Error("Firebase Auth instance is not available."));
      return;
    }

    // Subscribe to the authentication state change.
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser); // User is null if not signed in.
        setIsLoading(false);
      },
      (err) => {
        console.error('Error in onAuthStateChanged:', err);
        setError(err);
        setIsLoading(false);
      }
    );

    // Clean up the subscription when the component unmounts.
    return () => unsubscribe();
  }, [auth]); // Re-run the effect if the auth instance changes.

  return { user, isLoading, error };
}