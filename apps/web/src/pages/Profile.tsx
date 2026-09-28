import { useState, useEffect } from 'react';
import {
  User,
  Settings,
  Shield,
  Bell,
  Moon,
  Sun,
  LogOut,
  Award,
  Recycle,
  Users,
  Copy,
  Check,
  Loader2,
  Save,
  Camera,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Skeleton from '@/components/ui/skeleton';
import { useThemeStore } from '@/stores/theme';
import { useAuth } from '@/stores/auth';
import { useMe, useUpdateProfile, useWallet } from '@/lib/hooks';
import { useToast } from '@/stores/toast';

export default function Profile() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuth();
  const { data: user, isLoading, refetch } = useMe();
  const { data: wallet } = useWallet();
  const updateProfile = useUpdateProfile();
  const toast = useToast();

  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', bio: '', phone: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        bio: user.profile?.bio || '',
        phone: user.profile?.phone || '',
      });
    }
  }, [user]);

  const copyReferral = () => {
    const code = user?.username ? `ECO-${user.username.toUpperCase()}` : 'ECO-REFERRAL';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(form);
      setEditing(false);
      toast.success('Profile updated', 'Your profile has been saved');
    } catch {
      toast.error('Failed to update', 'Please try again');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div><Skeleton className="h-64 rounded-xl" /></div>
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.name || 'User';
  const displayUsername = user?.username || 'user';
  const avatarSrc = user?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${displayUsername}`;
  const level = user?.level || 1;
  const title = user?.xp && user?.xp > 5000 ? 'Eco Legend' : user?.xp && user?.xp > 2000 ? 'Eco Warrior' : 'Eco Beginner';
  const xpProgress = user?.xp ? ((user.xp % 1000) / 1000) * 100 : 0;
  const walletPoints = wallet?.points || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card + Stats */}
        <div className="space-y-5">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5" />
            <CardContent className="relative p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-emerald-500/20">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                    <Award className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-bold">{displayName}</h2>
              <p className="text-sm text-muted-foreground">@{displayUsername}</p>
              <p className="mt-2 text-sm">{user?.profile?.bio || 'No bio yet'}</p>
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant="premium">Level {level}</Badge>
                <Badge variant="success">{title}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>XP to next level</span>
                  <span className="text-emerald-400">{user?.xp ? 1000 - (user.xp % 1000) : 1000} XP</span>
                </div>
                <Progress value={xpProgress} className="h-2" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-secondary/50 p-3">
                {[
                  { icon: Award, value: `Lv.${level}`, label: 'Level' },
                  { icon: Recycle, value: `${walletPoints.toLocaleString()}`, label: 'Points' },
                  { icon: Users, value: '0', label: 'Friends' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Referral */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Referral Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 rounded-xl bg-secondary p-3">
                <code className="flex-1 text-sm font-mono text-emerald-400">
                  ECO-{displayUsername.toUpperCase()}
                </code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyReferral}>
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-400" /> Personal Information
                </CardTitle>
                {!editing && (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Camera className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <Input
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    disabled={!editing}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={user?.email || ''} type="email" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    disabled={!editing}
                    placeholder="+62"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  disabled={!editing}
                  placeholder="Tell us about yourself"
                />
              </div>
              {editing && (
                <div className="flex gap-2">
                  <Button variant="glow" onClick={handleSave} disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4 text-emerald-400" /> Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="h-5 w-5 text-emerald-400" /> : <Sun className="h-5 w-5 text-amber-400" />}
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Deposit confirmations, rewards, community</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input type="password" placeholder="Min. 8 characters" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
              </div>
              <Button variant="glow">Update Password</Button>

              <div className="mt-6 rounded-xl bg-red-500/5 border border-red-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-400">Danger Zone</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button variant="outline" className="w-full gap-2 h-12 text-base" onClick={logout}>
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
