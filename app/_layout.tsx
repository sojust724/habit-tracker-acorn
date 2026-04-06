import { QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { queryClient } from '../src/lib/queryClient';
import { useAuthListener } from '../src/hooks/useAuth';
import { useAuthStore } from '../src/store/authStore';
import '../global.css';

function AuthGate() {
  const session = useAuthStore((s) => s.session);
  const segments = useSegments();
  const router = useRouter();

  useAuthListener();

  useEffect(() => {
    const inAuth = segments[0] === '(auth)';
    if (!session && !inAuth) {
      router.replace('/(auth)');
    } else if (session && inAuth) {
      router.replace('/(app)');
    }
  }, [session, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}
