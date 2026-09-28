import { useState } from 'react';
import { Heart, MessageCircle, Share2, Award, TrendingUp, Plus, Crown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useCommunityPosts, useTrending, useToggleLike } from '@/lib/hooks';
import { mockLeaderboard } from '@/lib/mock-data';

export default function Community() {
  const { data: posts, isLoading } = useCommunityPosts();
  const { data: trending } = useTrending();
  const toggleLike = useToggleLike();
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    toggleLike.mutate(postId).catch(() => {});
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-7 w-40 bg-secondary/60 rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-secondary/60 rounded-lg animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-secondary/60 rounded-xl animate-pulse" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
          <div className="space-y-5">
            <div className="h-48 rounded-2xl bg-secondary/60 animate-pulse" />
            <div className="h-64 rounded-2xl bg-secondary/60 animate-pulse" />
            <div className="h-36 rounded-2xl bg-secondary/60 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-sm text-muted-foreground">Connect with fellow eco-warriors</p>
        </div>
        <Button variant="glow" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Create Post
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {(!posts || posts.length === 0) ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="font-semibold text-lg">No posts yet</p>
                <p className="text-sm text-muted-foreground mb-4">Be the first to share your eco journey!</p>
                <Button variant="glow">
                  <Plus className="mr-2 h-4 w-4" /> Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post: any) => {
              const badges: string[] = Array.isArray(post.badges) ? post.badges : [];
              return (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 p-5 pb-3">
                      <Avatar className="h-10 w-10 ring-2 ring-emerald-500/20">
                        <AvatarImage src={post.user?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${post.user?.username}`} />
                        <AvatarFallback>{post.user?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{post.user?.name || 'Unknown'}</p>
                          <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                            Lv.{post.user?.level || 0}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">@{post.user?.username} · {new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      {badges.length > 0 && (
                        <div className="flex gap-1">
                          {badges.map((badge: string) => (
                            <Badge key={badge} variant="success" className="text-[10px] h-5">{badge}</Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="px-5 pb-3 text-sm leading-relaxed">{post.content}</p>

                    {post.imageUrl && (
                      <div className="relative overflow-hidden">
                        <img src={post.imageUrl} alt="Post" className="w-full h-64 sm:h-80 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}

                    <div className="flex items-center gap-1 p-3 px-5 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn('gap-2 text-muted-foreground', likedPosts[post.id] && 'text-red-400')}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={cn('h-4 w-4', likedPosts[post.id] && 'fill-current')} />
                        {(post.likes || 0) + (likedPosts[post.id] ? 1 : 0)}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground ml-auto">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" /> Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(!trending || trending.length === 0) ? (
                <p className="text-sm text-muted-foreground text-center py-4">No trending topics yet</p>
              ) : (
                trending.map((tag: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400 cursor-pointer hover:underline">#{tag.title?.replace(/\s/g, '') || `trending-${i}`}</span>
                    <span className="text-xs text-muted-foreground">{tag.likes} likes</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-400" /> Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockLeaderboard.map((user) => (
                <div key={user.rank} className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                    user.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                    user.rank === 2 ? 'bg-slate-400/20 text-slate-400' :
                    user.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {user.rank === 1 ? <Crown className="h-3.5 w-3.5" /> : user.rank}
                  </div>
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.points.toLocaleString()} pts</p>
                  </div>
                  {user.rank === 1 && <Sparkles className="h-4 w-4 text-amber-400" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" /> Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['🌱', '♻️', '🏆', '⭐', '💚', '🌍'].map((emoji, i) => (
                  <div key={i} className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-lg cursor-pointer hover:bg-secondary/80 transition-all">
                    {emoji}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <button className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30 lg:hidden">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
