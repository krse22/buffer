import MainNavbar from '@/components/main-navbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNavbar />
      {children}
    </>
  );
}
