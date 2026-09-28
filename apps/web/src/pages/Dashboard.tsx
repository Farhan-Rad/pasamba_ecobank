import { Link } from 'react-router-dom';
import {
  Wallet,
  Leaf,
  TrendingUp,
  Recycle,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Gift,
  Handshake,
  Zap,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatCardSkeleton, ChartSkeleton, ListSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useMachines, useWallet, useTransactions, useTransactionSummary } from '@/lib/hooks';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const stats = [
  { label: 'Wallet Balance', icon: Wallet, getValue: (w: any) => w ? `Rp ${Number(w.balance).toLocaleString()}` : 'Rp 0', getChange: () => '+0%', positive: true },
  { label: 'Eco Points', icon: Leaf, getValue: (w: any) => w ? `${w.points.toLocaleString()} pts` : '0 pts', getChange: () => '+0%', positive: true },
  { label: 'CO₂ Saved', icon: TrendingUp, getValue: () => '12.3 kg', getChange: () => '+15%', positive: true },
  { label: 'Trees Equivalent', icon: Recycle, getValue: () => '8', getChange: () => '+2', positive: true },
];

const weeklyData = [
  { name: 'Mon', kg: 2.5 }, { name: 'Tue', kg: 4.0 }, { name: 'Wed', kg: 3.2 },
  { name: 'Thu', kg: 5.5 }, { name: 'Fri', kg: 6.0 }, { name: 'Sat', kg: 3.8 }, { name: 'Sun', kg: 4.5 },
];

const wasteData = [
  { name: 'Plastic', value: 45, color: '#10b981' },
  { name: 'Paper', value: 25, color: '#14b8a6' },
  { name: 'Metal', value: 18, color: '#06b6d4' },
  { name: 'Glass', value: 12, color: '#3b82f6' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-emerald-400">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data: machines, isLoading: machinesLoading } = useMachines();
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: transactions, isLoading: txnsLoading } = useTransactions();
  const { data: summary } = useTransactionSummary();

  const isPageLoading = machinesLoading || walletLoading || txnsLoading;

  if (isPageLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-7 w-40 bg-secondary/60 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-secondary/60 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2"><ListSkeleton rows={4} /></div>
          <ListSkeleton rows={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your recycling summary.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" className="gap-1">
            <Zap className="h-3 w-3" /> 12 day streak
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="relative overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.getValue(wallet)}</p>
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      stat.positive ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.getChange()}
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

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recycling Trend</CardTitle>
              <p className="text-sm text-muted-foreground">Daily waste collected this week</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="kg" stroke="#10b981" strokeWidth={2} fill="url(#areaGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Waste Composition</CardTitle>
            <p className="text-sm text-muted-foreground">By material type this month</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
                  <Tooltip content={({ active, payload }) =>
                    active && payload && payload.length ? (
                      <div className="rounded-xl border border-border bg-card p-3 shadow-xl">
                        <p className="text-sm font-medium">{payload[0].name}</p>
                        <p className="text-sm" style={{ color: payload[0].color }}>{payload[0].value}%</p>
                      </div>
                    ) : null
                  } />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                    {wasteData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {wasteData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machines + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Machine Status</CardTitle>
          </CardHeader>
          <CardContent>
            {(!machines || machines.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Recycle className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-medium">No machines available</p>
                <p className="text-sm text-muted-foreground">Check back later for nearby EcoATMs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {machines.map((machine: any) => (
                  <div key={machine.id} className="flex items-center gap-4 rounded-xl bg-secondary/50 p-4 transition-all hover:bg-secondary">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      machine.status === 'ONLINE' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                    )}>
                      <Recycle className={cn(
                        'h-5 w-5',
                        machine.status === 'ONLINE' ? 'text-emerald-400' : 'text-amber-400'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{machine.name}</p>
                        <span className={cn(
                          'inline-flex h-2 w-2 rounded-full',
                          machine.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-500'
                        )} />
                      </div>
                      <p className="text-xs text-muted-foreground">{machine.location}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <Progress value={machine.fillLevel} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">{machine.fillLevel}%</span>
                      </div>
                    </div>
                    <Badge variant={machine.status === 'ONLINE' ? 'success' : 'warning'} className="capitalize">
                      {machine.status.toLowerCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-emerald-400" asChild>
              <Link to="/transactions">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {(!transactions || transactions.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-medium">No activity yet</p>
                <p className="text-sm text-muted-foreground">Start recycling to see your activity here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.slice(0, 4).map((tx: any) => (
                  <div key={tx.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{tx.type[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{tx.description || tx.type}</p>
                        <span className={cn(
                          'text-xs font-medium',
                          tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                        )}>
                          {tx.amount > 0 ? '+' : ''}Rp{Math.abs(tx.amount).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: MapPin, label: 'Find ATM', desc: 'Locate nearby EcoATMs', color: 'from-emerald-500 to-emerald-600', path: '/atm-location' },
          { icon: Users, label: 'Community', desc: 'Share & connect', color: 'from-cyan-500 to-cyan-600', path: '/community' },
          { icon: Gift, label: 'Rewards', desc: 'Redeem your points', color: 'from-violet-500 to-violet-600', path: '/rewards' },
          { icon: Handshake, label: 'Invite Friends', desc: 'Earn referral bonus', color: 'from-amber-500 to-amber-600', path: '/friends' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} to={action.path}>
              <Card className="group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-all group-hover:scale-110',
                    action.color
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
