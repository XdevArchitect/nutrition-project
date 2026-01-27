'use client';

import { SessionProvider } from 'next-auth/react';
import { memo } from 'react';

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Memoize để tránh re-render không cần thiết
const AuthProvider = memo(AuthProviderContent);

export default AuthProvider;