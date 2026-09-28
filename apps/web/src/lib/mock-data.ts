export const mockUser = {
  id: '1',
  email: 'demo@ecobank.id',
  name: 'Demo User',
  username: 'demouser',
  avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=demo',
  role: 'USER' as const,
  xp: 4500,
  level: 4,
  profile: {
    bio: 'Passionate about recycling and saving the planet! 🌍',
    phone: '+628123456789',
  },
  createdAt: new Date('2024-01-15'),
};

export const mockAdminUser = {
  ...mockUser,
  id: 'admin-1',
  email: 'admin@ecobank.id',
  name: 'Admin EcoBank',
  username: 'admin',
  role: 'ADMIN' as const,
  xp: 12000,
  level: 10,
  profile: {
    bio: 'Platform administrator',
    phone: '+628987654321',
  },
};

export const mockWallet = {
  balance: 250000,
  points: 4500,
};

export const mockTransactions = [
  { id: 'tx-1', amount: 5000, type: 'DEPOSIT', status: 'COMPLETED', description: 'Plastic bottles deposit', category: 'Plastic', createdAt: new Date('2025-06-15T10:30:00') },
  { id: 'tx-2', amount: 2000, type: 'DEPOSIT', status: 'COMPLETED', description: 'Paper waste deposit', category: 'Paper', createdAt: new Date('2025-06-14T14:15:00') },
  { id: 'tx-3', amount: -1000, type: 'REDEEM', status: 'COMPLETED', description: 'Redeemed Eco Tote Bag', category: 'Rewards', createdAt: new Date('2025-06-13T09:00:00') },
  { id: 'tx-4', amount: 3500, type: 'DEPOSIT', status: 'COMPLETED', description: 'Glass bottles deposit', category: 'Glass', createdAt: new Date('2025-06-12T16:45:00') },
  { id: 'tx-5', amount: 8000, type: 'DEPOSIT', status: 'COMPLETED', description: 'Mixed recyclables', category: 'Mixed', createdAt: new Date('2025-06-11T11:20:00') },
  { id: 'tx-6', amount: 1500, type: 'BONUS', status: 'COMPLETED', description: 'Weekly streak bonus', category: 'Bonus', createdAt: new Date('2025-06-10T08:00:00') },
  { id: 'tx-7', amount: -2500, type: 'REDEEM', status: 'COMPLETED', description: 'Redeemed Plant Kit', category: 'Rewards', createdAt: new Date('2025-06-09T13:30:00') },
  { id: 'tx-8', amount: 6000, type: 'DEPOSIT', status: 'COMPLETED', description: 'Metal cans deposit', category: 'Metal', createdAt: new Date('2025-06-08T10:00:00') },
  { id: 'tx-9', amount: 10000, type: 'REFERRAL', status: 'COMPLETED', description: 'Referral bonus - Budi S.', category: 'Referral', createdAt: new Date('2025-06-07T15:00:00') },
  { id: 'tx-10', amount: -500, type: 'REDEEM', status: 'PENDING', description: 'Redeemed Sticker Pack', category: 'Rewards', createdAt: new Date('2025-06-06T12:10:00') },
];

export const mockTransactionSummary = {
  totalEarned: 36000,
  totalSpent: 4000,
  net: 32000,
};

export const mockMachines = [
  { id: 'm-1', name: 'Kota Kasablanka', location: 'Jakarta Selatan', status: 'ONLINE', fillLevel: 45, lastActive: new Date(), acceptedTypes: ['plastic', 'glass', 'metal'] },
  { id: 'm-2', name: 'Grand Indonesia', location: 'Jakarta Pusat', status: 'ONLINE', fillLevel: 72, lastActive: new Date(), acceptedTypes: ['plastic', 'paper', 'metal'] },
  { id: 'm-3', name: 'Trans Studio Mall', location: 'Bandung', status: 'MAINTENANCE', fillLevel: 30, lastActive: new Date('2025-06-14'), acceptedTypes: ['plastic', 'glass'] },
  { id: 'm-4', name: 'Tunjungan Plaza', location: 'Surabaya', status: 'ONLINE', fillLevel: 88, lastActive: new Date(), acceptedTypes: ['plastic', 'paper', 'glass', 'metal'] },
  { id: 'm-5', name: 'Mall Kelapa Gading', location: 'Jakarta Utara', status: 'ONLINE', fillLevel: 15, lastActive: new Date(), acceptedTypes: ['plastic', 'paper'] },
];

export const mockCommunityPosts = [
  {
    id: 'post-1',
    content: 'Just recycled 5kg of plastic bottles at Kota Kasablanka! Every bottle counts toward a cleaner planet. 🌍♻️',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    badges: ['Eco Warrior'],
    likes: 24,
    comments: 5,
    user: { id: 'u-1', name: 'Adi Pratama', username: 'adipratama', avatarUrl: null, level: 7 },
    createdAt: new Date('2025-06-15T09:00:00'),
  },
  {
    id: 'post-2',
    content: 'Did you know? Recycling one aluminum can saves enough energy to run a TV for 3 hours! Keep recycling! 💪',
    imageUrl: null,
    badges: [],
    likes: 18,
    comments: 3,
    user: { id: 'u-2', name: 'Budi Santoso', username: 'budisant', avatarUrl: null, level: 5 },
    createdAt: new Date('2025-06-14T14:00:00'),
  },
  {
    id: 'post-3',
    content: 'Hit Level 5 today! The EcoBank journey has been amazing. Thanks to everyone in this community for the inspiration! 🏆✨',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    badges: ['Level Up', 'Influencer'],
    likes: 42,
    comments: 12,
    user: { id: 'u-3', name: 'Rina Wijaya', username: 'rinawj', avatarUrl: null, level: 5 },
    createdAt: new Date('2025-06-13T11:30:00'),
  },
  {
    id: 'post-4',
    content: 'Just set up a home composting system. Reduces waste and creates great fertilizer for my plants! 🌱',
    imageUrl: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800',
    badges: ['Green Thumb'],
    likes: 31,
    comments: 8,
    user: { id: 'u-4', name: 'Sari Dewi', username: 'saridewi', avatarUrl: null, level: 3 },
    createdAt: new Date('2025-06-12T10:00:00'),
  },
];

export const mockTrendingTags = [
  { title: 'PlasticFreeJune', likes: 156 },
  { title: 'EcoTips', likes: 142 },
  { title: 'ZeroWaste', likes: 98 },
  { title: 'RecyclingChallenge', likes: 87 },
  { title: 'GreenLiving', likes: 73 },
];

export const mockLeaderboard = [
  { name: 'Adi Pratama', username: 'adipratama', points: 9200, rank: 1 },
  { name: 'Budi Santoso', username: 'budisant', points: 6800, rank: 2 },
  { name: 'Demo User', username: 'demouser', points: 4500, rank: 3 },
  { name: 'Rina Wijaya', username: 'rinawj', points: 3200, rank: 4 },
  { name: 'Sari Dewi', username: 'saridewi', points: 1500, rank: 5 },
];

export const mockRewards = [
  { id: 'r-1', name: 'Eco Tote Bag', description: 'Reusable shopping bag made from recycled materials', imageUrl: null, pointsCost: 1000, stock: 50, rarity: 'COMMON', category: 'Merch' },
  { id: 'r-2', name: 'Bamboo Toothbrush Set', description: 'Set of 4 biodegradable bamboo toothbrushes', imageUrl: null, pointsCost: 2500, stock: 30, rarity: 'UNCOMMON', category: 'Lifestyle' },
  { id: 'r-3', name: 'Reusable Water Bottle', description: 'Stainless steel, vacuum-insulated water bottle', imageUrl: null, pointsCost: 3500, stock: 20, rarity: 'UNCOMMON', category: 'Lifestyle' },
  { id: 'r-4', name: 'Plant Growing Kit', description: 'Complete starter kit with seeds, soil, and pots', imageUrl: null, pointsCost: 5000, stock: 15, rarity: 'RARE', category: 'Lifestyle' },
  { id: 'r-5', name: 'Solar Power Bank', description: '10,000mAh portable charger with solar panel', imageUrl: null, pointsCost: 8000, stock: 10, rarity: 'EPIC', category: 'Tech' },
  { id: 'r-6', name: 'Weekend Eco Retreat', description: '2-day stay at an eco-resort with workshops', imageUrl: null, pointsCost: 25000, stock: 3, rarity: 'LEGENDARY', category: 'Experience' },
];

export const mockAchievements = [
  { id: 'a-1', name: 'First Deposit', description: 'Made your first recycling deposit', iconUrl: '🏆', xpReward: 100, unlocked: true, unlockedAt: new Date('2025-01-20') },
  { id: 'a-2', name: 'Eco Beginner', description: 'Reach Level 2', iconUrl: '🌱', xpReward: 200, unlocked: true, unlockedAt: new Date('2025-02-10') },
  { id: 'a-3', name: 'Waste Warrior', description: 'Recycle 50kg of waste total', iconUrl: '♻️', xpReward: 500, unlocked: true, unlockedAt: new Date('2025-03-15') },
  { id: 'a-4', name: 'Streak Master', description: 'Maintain a 7-day recycling streak', iconUrl: '🔥', xpReward: 300, unlocked: true, unlockedAt: new Date('2025-04-01') },
  { id: 'a-5', name: 'Community Hero', description: 'Get 100 likes on your posts', iconUrl: '⭐', xpReward: 400, unlocked: false },
  { id: 'a-6', name: 'Eco Legend', description: 'Reach Level 10', iconUrl: '💚', xpReward: 1000, unlocked: false },
  { id: 'a-7', name: 'Tree Planter', description: 'Refer 5 friends to EcoBank', iconUrl: '🌳', xpReward: 600, unlocked: false },
  { id: 'a-8', name: 'Dedicated Recycler', description: 'Complete 100 deposits', iconUrl: '💎', xpReward: 800, unlocked: false },
];

export const mockFriends = [
  { id: 'f-1', name: 'Adi Pratama', username: 'adipratama', avatarUrl: null, level: 7 },
  { id: 'f-2', name: 'Budi Santoso', username: 'budisant', avatarUrl: null, level: 5 },
  { id: 'f-3', name: 'Rina Wijaya', username: 'rinawj', avatarUrl: null, level: 5 },
];

export const mockFriendRequests = [
  { id: 'fr-1', sender: { id: 'u-5', name: 'Dimas Ardian', username: 'dimasard', avatarUrl: null } },
  { id: 'fr-2', sender: { id: 'u-6', name: 'Putri Ayu', username: 'putriayu', avatarUrl: null } },
];

export const mockFriendSuggestions = [
  { id: 's-1', name: 'Dimas Ardian', username: 'dimasard', avatarUrl: null, level: 3, profile: { bio: 'Love recycling and nature 🌿' } },
  { id: 's-2', name: 'Putri Ayu', username: 'putriayu', avatarUrl: null, level: 4, profile: { bio: 'Zero waste enthusiast' } },
  { id: 's-3', name: 'Agus Wibowo', username: 'agusw', avatarUrl: null, level: 2, profile: { bio: 'New to eco lifestyle!' } },
  { id: 's-4', name: 'Dewi Lestari', username: 'dewilestari', avatarUrl: null, level: 6, profile: { bio: 'Eco blogger & activist' } },
];

export const mockRedemptionHistory = [
  { id: 'rh-1', rewardName: 'Eco Tote Bag', pointsSpent: 1000, redeemedAt: new Date('2025-06-13'), status: 'COMPLETED' },
  { id: 'rh-2', rewardName: 'Bamboo Toothbrush Set', pointsSpent: 2500, redeemedAt: new Date('2025-06-01'), status: 'COMPLETED' },
];

export const mockAdminStats = {
  totalUsers: 2847,
  activeMachines: 24,
  monthlyVolume: 12450,
  revenue: 89500000,
  usersGrowth: 12.5,
  machinesGrowth: 3,
  volumeGrowth: 18.2,
  revenueGrowth: 8.1,
};

export const mockAdminChartData = [
  { month: 'Jan', users: 1800, volume: 8000 },
  { month: 'Feb', users: 2000, volume: 9500 },
  { month: 'Mar', users: 2200, volume: 10200 },
  { month: 'Apr', users: 2500, volume: 11000 },
  { month: 'May', users: 2700, volume: 11800 },
  { month: 'Jun', users: 2847, volume: 12450 },
];

export const mockAdminRecentUsers = [
  { name: 'Demo User', email: 'demo@ecobank.id', deposits: 45, joined: '2 months ago', status: 'active' },
  { name: 'Budi Santoso', email: 'budi@example.com', deposits: 78, joined: '3 months ago', status: 'active' },
  { name: 'Sari Dewi', email: 'sari@example.com', deposits: 12, joined: '1 week ago', status: 'active' },
  { name: 'Adi Pratama', email: 'adi@example.com', deposits: 120, joined: '6 months ago', status: 'active' },
];

export const mockAdminMachines = [
  { name: 'Kota Kasablanka', location: 'Jakarta', status: 'online', fill: 45, lastActive: '2 min ago' },
  { name: 'Grand Indonesia', location: 'Jakarta', status: 'online', fill: 72, lastActive: '5 min ago' },
  { name: 'Trans Studio Mall', location: 'Bandung', status: 'maintenance', fill: 30, lastActive: '1 day ago' },
  { name: 'Tunjungan Plaza', location: 'Surabaya', status: 'online', fill: 88, lastActive: '1 min ago' },
];

export const DEMO_CREDENTIALS = {
  email: 'demo@ecobank.id',
  password: 'password123',
};
