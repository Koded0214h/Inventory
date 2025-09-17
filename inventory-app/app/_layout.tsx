// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/auth-context';
import React, { useEffect } from 'react';
import * as ExpoSplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
ExpoSplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Hide the native splash screen after the loading state is settled.
    if (!isLoading) {
      ExpoSplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(onboarding)';

      if (user && inAuthGroup) {
        // User is logged in, but on an onboarding screen, redirect to main app.
        router.replace('/(main)');
      } else if (!user && !inAuthGroup) {
        // User is not logged in and not on a public screen, redirect to login.
        router.replace('/(onboarding)/login');
      }
    }
  }, [user, isLoading, segments]);
  
  if (isLoading) {
    return null; 
  }

  // Use Slot to render the appropriate screen based on the URL
  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}