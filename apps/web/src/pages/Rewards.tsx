import { useState } from 'react';
import {
  Gift, Award, Star, Zap, Flame, Sparkles, Gem, Package, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Skeleton from '@/components/ui/skeleton';
import { useRewards, useAchievements, useRedeemReward, useRedemptionHistory, useMe, useWallet } from '@/lib/hooks';
import { useToast } from '@/stores/toast';
import { cn } from '@/lib/utils';

const rarityStyles: Record<string, string> = {
  COMMON: 'border-gray-500/30',
  UNCOMMON: 'border-emerald-500/30',
  RARE: 'border-blue-500/30',
  EPIC: 'border-purple-500/30',
  LEGENDARY: 'border-orange-500/30',
};

const rarityColors: Record<string, string> = {
  COMMON: 'text-gray-400',
  UNCOMMON: 'text-emerald-400',
  RARE: 'text-blue-400',
  EPIC: 'text-purple-400',
  LEGENDARY: 'text-orange-400',
};

export default function Rewards() {
  const { data: user } = useMe();
  const { data: wallet } = useWallet();
  const { data: achievements, isLoading: loadingAch } = useAchievements();
  const { data: rewards, isLoading: loadingRewards } = useRewards();
  const { data: history } = useRedemptionHistory();
  const redeem = useRedeemReward();
  const toast = useToast();

  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  const currentXp = user?.xp || 0;
  const nextLevelXp = (Math.floor(currentXp / 1000) + 1) * 1000;
  const xpProgress = ((currentXp % 1000) / 1000) * 100;
  const level = user?.level || 1;
  const title = currentXp > 5000 ? 'Eco Legend' : currentXp > 2000 ? 'Eco Warrior' : 'Eco Beginner';

  const filtered = selectedRarity
    ? (rewards || []).filter((r: any) => r.rarity === selectedRarity)
    : (rewards || []);

  const handleRedeem = async (reward: any) => {
    try {
      await redeem.mutateAsync(reward.id);
      toast.success('Reward Redeemed!', `You got: ${reward.name}`);
    } catch (err: any) {
      toast.error('Redemption failed', err.message || 'Not enough points or out of stock');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Rewards & Achievements</h1>
        <p className="text-sm text-muted-foreground">Earn points, unlock achievements, redeem rewards</p>
      </div>

      {/* XP & Level Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5" />
        <CardContent className="relative p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/25">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{level}</p>
                <p className="text-[10px] text-white/80 font-medium">LEVEL</p>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-lg">{title}</p>
                  <p className="text-sm text-muted-foreground">{currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</p>
                </div>
                <Badge variant="premium" className="gap-1">
                  <Zap className="h-3 w-3" /> {xpProgress.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={xpProgress} className="h-3" />
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Flame className="h-3.5 w-3.5" /> {level} day streak
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Gem className="h-3.5 w-3.5" /> {wallet?.points?.toLocaleString() || '0'} pts
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Achievements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-400" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAch ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : !achievements?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No achievements yet</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {(achievements || []).map((ach: any) => (
                  <div
                    key={ach.id}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border p-4 transition-all',
                      ach.unlocked
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-border bg-secondary/30 opacity-70',
                    )}
                  >
                    <div className="text-2xl">{ach.iconUrl || '🏆'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{ach.name}</p>
                        {ach.unlocked && <Sparkles className="h-3.5 w-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{ach.description}</p>
                      <p className="text-xs text-emerald-400 mt-1">+{ach.xpReward} XP</p>
                    </div>
                    {ach.unlocked && (
                      <Badge variant="success" className="text-[10px]">Done</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rewards Catalog */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-emerald-400" /> Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Rarity filter */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['all', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRarity(r === 'all' ? null : r)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all',
                    (selectedRarity === r || (!selectedRarity && r === 'all'))
                      ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
                      : 'bg-secondary text-muted-foreground hover:text-foreground',
                  )}
                >
                  {r === 'all' ? 'All' : r.toLowerCase()}
                </button>
              ))}
            </div>

            {loadingRewards ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : !filtered.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No rewards match this filter</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-hide">
                {filtered.map((reward: any) => (
                  <div key={reward.id} className={cn(
                    'rounded-xl border p-4 transition-all hover:bg-secondary/50',
                    rarityStyles[reward.rarity] || 'border-border'
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                        {reward.rarity === 'LEGENDARY' ? <Sparkles className="h-5 w-5 text-orange-400" /> :
                         reward.rarity === 'EPIC' ? <Gem className="h-5 w-5 text-purple-400" /> :
                         reward.rarity === 'RARE' ? <Star className="h-5 w-5 text-blue-400" /> :
                         <Package className="h-5 w-5 text-emerald-400" />}
                      </div>
                      <Badge variant="outline" className={cn('capitalize', rarityColors[reward.rarity] || 'text-gray-400')}>
                        {(reward.rarity || 'common').toLowerCase()}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold">{reward.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-400">{reward.pointsCost?.toLocaleString()} pts</span>
                      <Button
                        size="sm"
                        variant="glow"
                        className="h-8 text-xs"
                        disabled={redeem.isPending || (wallet?.points || 0) < reward.pointsCost || reward.stock <= 0}
                        onClick={() => handleRedeem(reward)}
                      >
                        {redeem.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Redeem'}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Stock: {reward.stock}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
