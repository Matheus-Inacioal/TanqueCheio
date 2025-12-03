'use client';

import React, { ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // The purpose of this component is to ensure that FirebaseProvider,
  // which handles initialization, is only ever rendered on the client.
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
