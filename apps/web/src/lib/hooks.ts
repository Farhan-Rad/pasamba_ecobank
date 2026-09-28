import { useMemo } from 'react';
import {
  mockWallet,
  mockTransactions,
  mockTransactionSummary,
  mockMachines,
  mockCommunityPosts,
  mockTrendingTags,
  mockRewards,
  mockAchievements,
  mockFriends,
  mockFriendRequests,
  mockFriendSuggestions,
  mockRedemptionHistory,
  mockAdminStats,
  mockAdminChartData,
  mockAdminRecentUsers,
  mockAdminMachines,
  mockUser,
} from './mock-data';

function delay(ms: number = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function useMockQuery<T>(key: string, data: T, enabled: boolean = true) {
  return useMemo(() => ({
    data: enabled ? data : undefined,
    isLoading: false,
    error: null,
    refetch: async () => { await delay(); return { data }; },
  }), [key, data, enabled]);
}

function useMockMutation<TData, TVariables>(fn: (vars: TVariables) => Promise<TData>) {
  return useMemo(() => ({
    mutate: async (vars: TVariables) => { await delay(); return fn(vars); },
    mutateAsync: async (vars: TVariables) => { await delay(); return fn(vars); },
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    reset: () => {},
  }), [fn]);
}

export function useMe() {
  return useMockQuery('me', mockUser, true);
}

export function useUpdateProfile() {
  return useMockMutation(async (data: { name?: string; bio?: string; phone?: string; username?: string; avatarUrl?: string }) => {
    return { ...mockUser, ...data };
  });
}

export function useMachines() {
  return useMockQuery('machines', mockMachines, true);
}

export function useMachine(id: string) {
  const machine = mockMachines.find((m) => m.id === id);
  return useMockQuery(`machines-${id}`, machine || null, !!id);
}

export function useWallet() {
  return useMockQuery('wallet', mockWallet, true);
}

export function useTransactions(params?: Record<string, string>) {
  let filtered = [...mockTransactions];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((t) =>
      t.description?.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
    );
  }
  if (params?.type) {
    filtered = filtered.filter((t) => t.type === params.type);
  }
  return useMockQuery('transactions', filtered, true);
}

export function useTransactionSummary() {
  return useMockQuery('transactions-summary', mockTransactionSummary, true);
}

export function useCommunityPosts() {
  return useMockQuery('community-posts', mockCommunityPosts, true);
}

export function useTrending() {
  return useMockQuery('community-trending', mockTrendingTags, true);
}

export function useToggleLike() {
  return useMockMutation(async (postId: string) => ({ success: true, postId }));
}

export function useCreatePost() {
  return useMockMutation(async (data: { content: string; imageUrl?: string }) => {
    return { id: `post-${Date.now()}`, ...data, createdAt: new Date() };
  });
}

export function useRewards() {
  return useMockQuery('rewards', mockRewards, true);
}

export function useRedeemReward() {
  return useMockMutation(async (rewardId: string) => ({ success: true, rewardId }));
}

export function useRedemptionHistory() {
  return useMockQuery('rewards-history', mockRedemptionHistory, true);
}

export function useAchievements() {
  return useMockQuery('achievements', mockAchievements, true);
}

export function useFriends() {
  return useMockQuery('friends', mockFriends, true);
}

export function useFriendRequests() {
  return useMockQuery('friends-requests', mockFriendRequests, true);
}

export function useFriendSuggestions() {
  return useMockQuery('friends-suggestions', mockFriendSuggestions, true);
}

export function useSendFriendRequest() {
  return useMockMutation(async (userId: string) => ({ success: true, userId }));
}

export function useAcceptFriendRequest() {
  return useMockMutation(async (requestId: string) => ({ success: true, requestId }));
}

export function useRejectFriendRequest() {
  return useMockMutation(async (requestId: string) => ({ success: true, requestId }));
}

export function useAdminStats() {
  return useMockQuery('admin-stats', mockAdminStats, true);
}

export function useAdminChartData() {
  return useMockQuery('admin-chart-data', mockAdminChartData, true);
}

export function useAdminRecentUsers() {
  return useMockQuery('admin-recent-users', mockAdminRecentUsers, true);
}

export function useAdminMachines() {
  return useMockQuery('admin-machines', mockAdminMachines, true);
}
