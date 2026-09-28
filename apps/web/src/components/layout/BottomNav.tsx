import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Gift,
  History,
  UserCircle,
  MapPin,
  Handshake,
} from 'lucide-react';

const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: MapPin, label: 'ATMs', path: '/atm-location' },
  { icon: Gift, label: 'Rewards', path: '/rewards' },
  { icon: History, label: 'History', path: '/transactions' },
  { icon: Handshake, label: 'Friends', path: '/friends' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-border bg-background/80 backdrop-blur-xl lg:hidden">
      {mobileNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors',
              isActive ? 'text-emerald-400' : 'text-muted-foreground',
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="truncate max-w-full px-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
