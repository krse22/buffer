'use client';

import { getCookie } from '@/utils/get-cookie';
import { LoginButton } from '@/components/login-button';

export default function Home() {
  const cookie = getCookie('authenticated');
  const isAuthenticated = cookie === 'true';

  if (isAuthenticated) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <main className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Buffer
          </h1>
          <p className="text-gray-600">
            Select a channel from the sidebar to get started.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gray-50">
      <main className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Buffer
        </h1>
        <p className="text-gray-600 mb-8">
          Connect your social accounts and manage your content.
        </p>
        <LoginButton />
      </main>
    </div>
  );
}
