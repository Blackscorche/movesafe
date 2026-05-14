export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  is_new_user: boolean;
  phone_verified: boolean;
}

export interface OTPRequestResponse {
  success: boolean;
  message: string;
  expiresIn: number;
}

export interface OTPVerifyResponse {
  success: boolean;
  data: {
    user: User;
    tokens: AuthTokens;
    isNewUser: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  joinedAt: string;
}

export interface StepData {
  date: string;
  steps: number;
  goal: number;
  goalMet: boolean;
  distance: number;
  calories: number;
  minutes: number;
  gcEarned: number;
}

export interface GuaCoinBalance {
  total: number;
  reserved: number;
  available: number;
  expiringAmount: number;
  expiringDays: number;
}

export type TransactionType = 'emision' | 'canje' | 'bonus';
export type TransactionStatus = 'confirmed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  subtitle: string;
  storeName?: string;
  steps?: number;
  date: string;
  status: TransactionStatus;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  positiveCount?: number;
  negativeCount?: number;
  positivePercentage: number;
  distance: number;
  address: string;
  phone: string;
  hours: string;
  isOpen: boolean;
  isFeatured: boolean;
  isFavorite: boolean;
  couponsCount: number;
  discount?: number;
  canjes?: number;
}

export interface Coupon {
  id: string;
  storeId: string;
  storeName: string;
  title: string;
  description: string;
  discount: number;
  cost: number;
  available: number;
  validUntil: string;
  isRedeemed?: boolean;
}

export interface Merchant {
  id: string;
  business_name: string;
  business_type: string;
  rif: string;
  verification_status: string;
  subscription_status: string;
  tier: string;
  level: string;
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  distance_km: number | null;
  approval_pct: number | null;
  total_votes: number;
}

export interface MerchantDetail extends Merchant {
  phone: string | null;
  email: string | null;
  address: string | null;
  photo_url: string | null;
  stars: number;
}

export interface MerchantListResponse {
  merchants: Merchant[];
  total: number;
}

export interface DashboardResponse {
  user_id: string;
  display_name: string | null;
  wallet_balance: number;
  wallet_reserved: number;
  wallet_available: number;
  level: number;
  xp: number;
  xp_to_next_level: number;
  streak_days: number;
  bonus_streak_days: number;
  longest_streak: number;
  total_redemptions: number;
  badges_unlocked: number;
  active_batches: number;
  expiring_amount: number;
  expiring_days: number;
}

export interface TransactionItem {
  id: string;
  type: string;
  status: string;
  amount: number;
  direction: string;
  created_at: string;
}

export interface TransactionListResponse {
  items: TransactionItem[];
  total: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  icon: string;
  iconColor: string;
}
