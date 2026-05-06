import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { getProfile } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile || profile.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-[#F6F9FC] font-sans">
      {/* SIDEBAR FIXA */}
      <Sidebar />

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
