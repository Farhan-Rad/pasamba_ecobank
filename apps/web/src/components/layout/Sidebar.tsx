import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';
import { useThemeStore } from '@/stores/theme';
import {
  LayoutDashboard,
  Users,
  Gift,
  History,
  UserCircle,
  Handshake,
  Recycle,
  MapPin,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/stores/auth';
import { useEffect, useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: Gift, label: 'Rewards', path: '/rewards' },
  { icon: History, label: 'History', path: '/transactions' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Handshake, label: 'Friends', path: '/friends' },
  { icon: MapPin, label: 'ATM Location', path: '/atm-location' },
];

export function Sidebar() {
  const location = useLocation();
  const { isOpen, toggle } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
        isOpen ? 'w-64' : 'w-16',
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b border-border px-4', isOpen ? 'justify-between' : 'justify-center')}>
        {isOpen ? (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="gradient-text">Eco</span>
              <span className="text-foreground">Bank</span>
            </span>
          </Link>
        ) : (
          <Link to="/">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
              <Leaf className="h-5 w-5 text-white" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                !isOpen && 'justify-center px-2',
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-emerald-400')} />
              {isOpen && <span>{item.label}</span>}
              {isOpen && isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className={cn('border-t border-border p-3 space-y-2', !isOpen && 'flex flex-col items-center')}>
        <div className={cn('flex', isOpen ? 'gap-2' : 'flex-col gap-2')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <Link to="/profile" className={cn('flex items-center gap-3 rounded-xl p-2 hover:bg-secondary/50 transition-colors', isOpen ? '' : 'justify-center')}>
          <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20">
            <AvatarImage src={user?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.username || 'demo'}`} />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Demo User'}</p>
              <p className="text-xs text-muted-foreground truncate">@{user?.username || 'demouser'}</p>
            </div>
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-8 w-8 rounded-lg mx-auto"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
