"use client";

import { useMemo, type DependencyList } from 'react';
import {
  Query,
  DocumentData,
} from 'firebase/firestore';

/**
 * A hook that memoizes a Firestore query or document reference.
 * It's a wrapper around React's `useMemo` that adds a `__memo` property
 * to the returned object. This property is used by `useCollection` and `useDoc`
 * to ensure that the query or reference is properly memoized.
 *
 * @param factory A function that returns a Firestore query or document reference.
 * @param deps An array of dependencies for the `useMemo` hook.
 * @returns The memoized query or document reference.
 */

export function useMemoFirebase<T extends Query<DocumentData>>(
  factory: () => T | null,
  deps: DependencyList
): (T & { __memo?: boolean }) | null {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedQuery = useMemo(factory, deps);

  if (memoizedQuery) {
    (memoizedQuery as any).__memo = true;
  }

  return memoizedQuery;
}
