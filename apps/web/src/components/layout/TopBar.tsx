import { Link } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebarStore } from '@/stores/sidebar';
import { useAuth } from '@/stores/auth';

export function TopBar() {
  const { toggle, isMobile } = useSidebarStore();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-6">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-10 h-9 rounded-xl bg-secondary border-0"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-bold">
            3
          </span>
        </Button>
        <Link to="/profile">
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-emerald-500/20">
            <AvatarImage src={user?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.username || 'demo'}`} />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
