import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { PageTransition } from './PageTransition';
import { useSidebarStore } from '@/stores/sidebar';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function AppShell() {
  const { isOpen, setMobile } = useSidebarStore();

  useEffect(() => {
    const check = () => {
      setMobile(window.innerWidth < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [setMobile]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          isOpen ? 'lg:ml-64' : 'lg:ml-16',
        )}
      >
        <TopBar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
