export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  OTP: { identifier: string; type: 'phone' | 'email' };
  HealthPermission: undefined;
  WelcomeBadge: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ShopTab: undefined;
  QRModal: undefined;
  CoinsTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  StepsDetail: undefined;
};

export type ShopStackParamList = {
  Shop: undefined;
  StoreDetail: { storeId: string };
  QRScreen: { couponId: string };
  RedeemSuccess: { couponId: string; storeName: string; gcSpent: number; discount: number };
};

export type CoinsStackParamList = {
  Coins: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  Help: undefined;
};
