import {
  Users,
  Recycle,
  TrendingUp,
  DollarSign,
  Activity,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAdminStats, useAdminChartData, useAdminRecentUsers, useAdminMachines } from '@/lib/hooks';
import { useAuth } from '@/stores/auth';
import { Navigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm">
            {entry.name === 'users' ? 'Users: ' : 'Volume: '}
            {entry.name === 'users' ? entry.value.toLocaleString() : `${entry.value.toLocaleString()} kg`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Admin() {
  const { isAdmin } = useAuth();
  const { data: stats } = useAdminStats();
  const { data: chartData } = useAdminChartData();
  const { data: recentUsers } = useAdminRecentUsers();
  const { data: machines } = useAdminMachines();

  if (!isAdmin) return <Navigate to="/" replace />;

  const adminStats = [
    { label: 'Total Users', value: stats?.totalUsers?.toLocaleString() || '0', icon: Users, change: `+${stats?.usersGrowth || 0}%`, positive: true },
    { label: 'Active Machines', value: String(stats?.activeMachines || 0), icon: Recycle, change: `+${stats?.machinesGrowth || 0}`, positive: true },
    { label: 'Monthly Volume', value: `${(stats?.monthlyVolume || 0).toLocaleString()} kg`, icon: TrendingUp, change: `+${stats?.volumeGrowth || 0}%`, positive: true },
    { label: 'Revenue', value: `Rp ${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, change: `+${stats?.revenueGrowth || 0}%`, positive: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform overview and management</p>
        </div>
        <Badge variant="premium">Admin Access</Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      stat.positive ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-3 ring-1 ring-emerald-500/20">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData || []}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" name="users" stroke="#10b981" strokeWidth={2} fill="url(#usersGradient)" />
                <Area type="monotone" dataKey="volume" name="volume" stroke="#14b8a6" strokeWidth={2} fill="url(#volumeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Users</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {(recentUsers || []).map((user: any) => (
              <div key={user.email} className="flex items-center gap-3 rounded-xl bg-secondary/30 p-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-medium">{user.deposits} deposits</p>
                  <p className="text-muted-foreground">{user.joined}</p>
                </div>
                <Badge variant="success" className="text-[10px] capitalize">{user.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Manage Machines', desc: 'Add, edit, or remove EcoATM machines', icon: Recycle },
              { label: 'User Management', desc: 'View, edit, or suspend user accounts', icon: Users },
              { label: 'Rewards Catalog', desc: 'Manage reward items and stock levels', icon: TrendingUp },
              { label: 'Transaction Logs', desc: 'View all platform transactions', icon: Activity },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.label} className="flex items-center gap-3 rounded-xl bg-secondary/30 p-3 cursor-pointer hover:bg-secondary/50 transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Machine Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Machine Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-medium text-muted-foreground pb-3">Name</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Location</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Status</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Fill Level</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">Last Active</th>
                  <th className="text-right font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(machines || []).map((m: any) => (
                  <tr key={m.name} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{m.name}</td>
                    <td className="py-3 text-muted-foreground">{m.location}</td>
                    <td className="py-3">
                      <Badge variant={m.status === 'online' ? 'success' : 'warning'} className="capitalize">{m.status}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 max-w-[120px]">
                        <Progress value={m.fill} className="h-1.5" />
                        <span className="text-xs">{m.fill}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{m.lastActive}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
