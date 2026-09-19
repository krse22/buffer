'use client';

import { LoginButton } from '@/components/login-button';

export default function Login() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gray-50">
      <main className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Buffer Gaze
        </h1>
        <p className="text-gray-600 mb-8">
          Connect your social accounts and manage your content.
        </p>
        <LoginButton />
      </main>
    </div>
  );
}
