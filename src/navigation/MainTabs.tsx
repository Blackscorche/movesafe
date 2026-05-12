import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../utils/theme';
import { BottomNav } from '../components/common/BottomNav';
import { HomeScreen } from '../screens/main/HomeScreen';
import { StepsDetailScreen } from '../screens/main/StepsDetailScreen';
import { ShopScreen } from '../screens/main/ShopScreen';
import { StoreDetailScreen } from '../screens/main/StoreDetailScreen';
import { QRScreen } from '../screens/main/QRScreen';
import { RedeemSuccessScreen } from '../screens/main/RedeemSuccessScreen';
import { CoinsScreen } from '../screens/main/CoinsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { HelpScreen } from '../screens/help/HelpScreen';

const HomeStackNav = createNativeStackNavigator();
const ShopStackNav = createNativeStackNavigator();
const CoinsStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
    <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
    <HomeStackNav.Screen name="StepsDetail" component={StepsDetailScreen} />
  </HomeStackNav.Navigator>
);

const ShopStack = () => (
  <ShopStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ShopStackNav.Screen name="ShopMain" component={ShopScreen} />
    <ShopStackNav.Screen name="StoreDetail" component={StoreDetailScreen} />
    <ShopStackNav.Screen name="QRScreen" component={QRScreen} />
    <ShopStackNav.Screen name="RedeemSuccess" component={RedeemSuccessScreen} />
  </ShopStackNav.Navigator>
);

const CoinsStack = () => (
  <CoinsStackNav.Navigator screenOptions={{ headerShown: false }}>
    <CoinsStackNav.Screen name="CoinsMain" component={CoinsScreen} />
  </CoinsStackNav.Navigator>
);

const ProfileStack = () => (
  <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStackNav.Screen name="Settings" component={SettingsScreen} />
    <ProfileStackNav.Screen name="Help" component={HelpScreen} />
  </ProfileStackNav.Navigator>
);

const TabBarComponent = ({ state, navigation }: any) => {
  if (!state || !state.routeNames) return null;
  const activeKey = state.routeNames[state.index];
  return (
    <BottomNav
      activeTab={activeKey}
      onTabPress={(key) => navigation.navigate(key)}
    />
  );
};

const QRStackNav = createNativeStackNavigator();

const QRStack = () => (
  <QRStackNav.Navigator screenOptions={{ headerShown: false }}>
    <QRStackNav.Screen name="QRMain" component={QRScreen} />
    <QRStackNav.Screen name="RedeemSuccessQR" component={RedeemSuccessScreen} />
  </QRStackNav.Navigator>
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBarComponent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ShopTab" component={ShopStack} />
      <Tab.Screen name="QRModal" component={QRStack} />
      <Tab.Screen name="CoinsTab" component={CoinsStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
};
