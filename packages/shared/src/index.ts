export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  REDEEM = 'REDEEM',
  BONUS = 'BONUS',
  REFERRAL = 'REFERRAL',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum MachineStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  FULL = 'FULL',
}

export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: Role;
  xp: number;
  level: number;
  createdAt: Date;
}

export interface WalletResponse {
  balance: number;
  points: number;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string | null;
  category: string | null;
  createdAt: Date;
}

export interface MachineResponse {
  id: string;
  name: string;
  location: string;
  status: MachineStatus;
  fillLevel: number;
  lastActive: Date | null;
  acceptedTypes: string[];
}

export interface PostResponse {
  id: string;
  content: string;
  imageUrl: string | null;
  badges: string[];
  likes: number;
  comments: number;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
    level: number;
  };
  createdAt: Date;
}

export interface RewardResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  pointsCost: number;
  stock: number;
  rarity: Rarity;
  category: string;
}

export interface AchievementResponse {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface DepositRequest {
  machineId: string;
  weight: number;
  wasteType: string;
  images?: string[];
}
