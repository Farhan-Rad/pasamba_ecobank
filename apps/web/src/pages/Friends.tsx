import { useState } from 'react';
import {
  UserPlus, MessageCircle, Search, Users, Clock, Check, X, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Skeleton from '@/components/ui/skeleton';
import {
  useFriends, useFriendRequests, useFriendSuggestions,
  useSendFriendRequest, useAcceptFriendRequest, useRejectFriendRequest,
} from '@/lib/hooks';
import { useToast } from '@/stores/toast';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'pending' | 'suggested';

export default function Friends() {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');

  const { data: friends, isLoading: loadingFriends } = useFriends();
  const { data: requests, isLoading: loadingRequests } = useFriendRequests();
  const { data: suggestions, isLoading: loadingSuggestions } = useFriendSuggestions();

  const sendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();
  const toast = useToast();

  const handleSendRequest = async (userId: string) => {
    try {
      await sendRequest.mutateAsync(userId);
      toast.success('Friend request sent');
    } catch (err: any) {
      toast.error('Failed to send request', err.message);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest.mutateAsync(requestId);
      toast.success('Friend request accepted');
    } catch (err: any) {
      toast.error('Failed to accept', err.message);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest.mutateAsync(requestId);
      toast.info('Friend request rejected');
    } catch (err: any) {
      toast.error('Failed to reject', err.message);
    }
  };

  const tabs = [
    { key: 'all' as Tab, label: 'All Friends', count: friends?.length || 0 },
    { key: 'pending' as Tab, label: 'Pending', count: requests?.length || 0 },
    { key: 'suggested' as Tab, label: 'Suggestions', count: suggestions?.length || 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Friends</h1>
        <p className="text-sm text-muted-foreground">Connect with the EcoBank community</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
              tab === t.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.key === 'all' && <Users className="h-4 w-4" />}
            {t.key === 'pending' && <Clock className="h-4 w-4" />}
            {t.key === 'suggested' && <UserPlus className="h-4 w-4" />}
            {t.label}
            {t.count > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                {t.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tab: All Friends */}
      {tab === 'all' && (
        <div className="space-y-3">
          {loadingFriends ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))
          ) : !friends?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No friends yet</p>
              <p className="text-sm">Connect with others to grow your network</p>
            </div>
          ) : (
            friends
              .filter((f: any) =>
                !search || f.name?.toLowerCase().includes(search.toLowerCase()) || f.username?.toLowerCase().includes(search.toLowerCase())
              )
              .map((friend: any) => (
                <Card key={friend.id} className="hover:bg-secondary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={friend.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${friend.username}`} />
                        <AvatarFallback>{friend.name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">@{friend.username}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Lv.{friend.level || 1}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}

      {/* Tab: Pending Requests */}
      {tab === 'pending' && (
        <div className="space-y-3">
          {loadingRequests ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))
          ) : !requests?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No pending requests</p>
              <p className="text-sm">Friend requests from others will appear here</p>
            </div>
          ) : (
            requests.map((req: any) => (
              <Card key={req.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={req.sender?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${req.sender?.username}`} />
                      <AvatarFallback>{req.sender?.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{req.sender?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">@{req.sender?.username || 'unknown'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="glow"
                        className="h-8 w-8 p-0"
                        onClick={() => handleAccept(req.id)}
                        disabled={acceptRequest.isPending}
                      >
                        {acceptRequest.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleReject(req.id)}
                        disabled={rejectRequest.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab: Suggestions */}
      {tab === 'suggested' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {loadingSuggestions ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : !suggestions?.length ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No suggestions</p>
              <p className="text-sm">Invite friends to grow the community</p>
            </div>
          ) : (
            suggestions.map((suggestion: any) => (
              <Card key={suggestion.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={suggestion.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${suggestion.username}`} />
                      <AvatarFallback>{suggestion.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate text-sm">{suggestion.name}</p>
                      <p className="text-xs text-muted-foreground">@{suggestion.username}</p>
                      {suggestion.profile?.bio && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{suggestion.profile.bio}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="glow"
                      className="h-8 shrink-0"
                      onClick={() => handleSendRequest(suggestion.id)}
                      disabled={sendRequest.isPending}
                    >
                      {sendRequest.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3 mr-1" />}
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
