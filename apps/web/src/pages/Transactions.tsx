import { useState } from 'react';
import { Download, Filter, Search, Calendar, ArrowUpRight, ArrowDownRight, Award, UserPlus, Recycle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ListSkeleton, ChartSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useTransactions, useTransactionSummary } from '@/lib/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', earned: 12000, spent: 2000 },
  { month: 'Feb', earned: 18000, spent: 3500 },
  { month: 'Mar', earned: 15000, spent: 1000 },
  { month: 'Apr', earned: 22000, spent: 5000 },
  { month: 'May', earned: 28000, spent: 1500 },
  { month: 'Jun', earned: 25000, spent: 3000 },
];

const categoryIcons: Record<string, any> = {
  DEPOSIT: ArrowUpRight,
  REDEEM: ArrowDownRight,
  BONUS: Award,
  REFERRAL: UserPlus,
};

const categoryColors: Record<string, string> = {
  DEPOSIT: 'text-emerald-400 bg-emerald-500/10',
  REDEEM: 'text-red-400 bg-red-500/10',
  BONUS: 'text-blue-400 bg-blue-500/10',
  REFERRAL: 'text-purple-400 bg-purple-500/10',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-xl">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {entry.name === 'earned' ? 'Earned: ' : 'Spent: '}Rp{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Transactions() {
  const { data: transactions, isLoading: txnsLoading } = useTransactions();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const [search, setSearch] = useState('');

  const isLoading = txnsLoading || summaryLoading;

  const filteredTransactions = (transactions || []).filter((tx: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tx.description?.toLowerCase().includes(q) ||
      tx.type?.toLowerCase().includes(q) ||
      tx.category?.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-7 w-48 bg-secondary/60 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-secondary/60 rounded-lg animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-secondary/60 animate-pulse" />
          ))}
        </div>
        <ChartSkeleton />
        <ListSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-sm text-muted-foreground">Track your recycling activity and earnings</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold text-emerald-400">
              Rp {(summary?.totalEarned || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-red-400">
              Rp {(summary?.totalSpent || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p className="text-2xl font-bold">
              Rp {((summary?.net || 0)).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="earned" name="earned" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="spent" name="spent" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-10 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" /> Date Range
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {(!filteredTransactions || filteredTransactions.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Recycle className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="font-semibold text-lg">
                {search ? 'No matching transactions' : 'No transactions yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                {search ? 'Try a different search term' : 'Your recycling deposits will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredTransactions.map((tx: any) => {
                const Icon = categoryIcons[tx.type] || Recycle;
                return (
                  <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', categoryColors[tx.type] || 'bg-muted text-muted-foreground')}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{tx.description || tx.type}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <Badge variant={tx.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[10px] capitalize">
                          {tx.status?.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                    <span className={cn(
                      'text-sm font-semibold whitespace-nowrap',
                      tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {tx.amount > 0 ? '+' : ''}Rp{Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
