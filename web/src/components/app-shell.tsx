'use client';

import { getCookie } from '@/utils/get-cookie';
import MainNavbar from '@/components/main-navbar';
import { AuthenticatedLayout } from '@/components/authenticated-layout';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const cookie = getCookie('authenticated');
  const isAuthenticated = cookie === 'true';

  if (isAuthenticated) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  return (
    <>
      <MainNavbar />
      {children}
    </>
  );
}
