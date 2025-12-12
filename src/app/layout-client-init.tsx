'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { loadUserFromStorage } from '@/lib/redux/slices/authSlice';

/**
 * Client-side initialization component
 * Handles initial data loading that requires client-side APIs
 */
export default function ClientInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load user from localStorage on client mount
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return null;
}

