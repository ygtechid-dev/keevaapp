import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../SplashScreen';
import OnboardingScreen from '../OnboardingScreen';
import LoginScreen from '../LoginScreen';
import OtpScreen from '../OtpScreen';
import RegisterScreen from '../RegisterScreen';
import LocationAccessScreen from '../LocationAccessScreen';
import StoreSelectionScreen from '../StoreSelectionScreen';
import SellerLoginScreen from '../SellerLoginScreen';

import KesehatanTokoScreen from '../KesehatanTokoScreen';
import FormKlaimScreen from '../FormKlaimScreen';
import UpgradeScreen from '../UpgradeScreen';
import BarangBelumSampaiScreen from '../BarangBelumSampaiScreen';
import BarangSudahCairScreen from '../BarangSudahCairScreen';
// FIX: Import dengan named export
import { BarangHilangScreen, SelisihOngkirScreen } from '../BarangHilangScreen';
import LaporanKeuanganDashboard from '../LaporanKeuanganDashboard';
import LaporanPesananScreen from '../LaporanPesananScreen';
import LaporanPenjualanScreen from '../LaporanPenjualanScreen';
import MonitoringKlaimScreen from '../MonitoringKlaimScreen';
import PusatBantuanScreen from '../PusatBantuanScreen';
import LazadaOauthScreen from '../LazadaOauthScreen';



import DetailPesananScreen from '../DetailPesananScreen';
import VerifyOTPScreen from '../VerifyOTPScreen';

import NotifikasiScreen from '../NotifikasiScreen';

import HomeTab from '../tabs/HomeTab';
import TransactionTab from '../tabs/TransactionTab';
import ProfileTab from '../tabs/ProfileTab';
import KesehatanTokoTab from '../tabs/KesehatanTokoTab';

import BantuanTab from '../tabs/BantuanTab';


import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ---------- BOTTOM TABS ----------
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#999',

        tabBarIcon: ({ focused, color, size }) => {
          let icon = 'home-outline';

          if (route.name === 'HomeTab') icon = focused ? 'home' : 'home-outline';
          if (route.name === 'TransactionTab') icon = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          if (route.name === 'AnalisaTab') icon = focused ? 'analytics' : 'analytics';
          if (route.name === 'ProfileTab') icon = focused ? 'person' : 'person-outline';

          return <Ionicons name={icon} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeTab} options={{ title: "Home" }} />
      <Tab.Screen name="TransactionTab" component={TransactionTab} options={{ title: "Order" }} />
      <Tab.Screen name="AnalisaTab" component={KesehatanTokoTab} options={{ title: "Analisa" }} />
      <Tab.Screen name="ProfileTab" component={ProfileTab} options={{ title: "Akun" }} />
    </Tab.Navigator>
  );
}

// ---------- MAIN ROUTER ----------
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="LocationAccessScreen" component={LocationAccessScreen} />
        <Stack.Screen name="StoreSelectionScreen" component={StoreSelectionScreen} />
        <Stack.Screen name="SellerLoginScreen" component={SellerLoginScreen} />

        {/* Kesehatan Toko & Klaim Screens */}
        <Stack.Screen name="KesehatanTokoScreen" component={KesehatanTokoScreen} />
        <Stack.Screen name="FormKlaimScreen" component={FormKlaimScreen} />
        <Stack.Screen name="UpgradeScreen" component={UpgradeScreen} />
        
        {/* Laporan Keuangan Screens */}
        <Stack.Screen name="LaporanKeuanganDashboard" component={LaporanKeuanganDashboard} />
        <Stack.Screen name="BarangBelumSampaiScreen" component={BarangBelumSampaiScreen} />
        <Stack.Screen name="BarangSudahCairScreen" component={BarangSudahCairScreen} />
        <Stack.Screen name="BarangHilangScreen" component={BarangHilangScreen} />
        <Stack.Screen name="SelisihOngkirScreen" component={SelisihOngkirScreen} />

        <Stack.Screen name="LaporanPesananScreen" component={LaporanPesananScreen} />
        <Stack.Screen name="DetailPesananScreen" component={DetailPesananScreen} />
        <Stack.Screen name="LaporanPenjualanScreen" component={LaporanPenjualanScreen} />
        <Stack.Screen name="MonitoringKlaimScreen" component={MonitoringKlaimScreen} />
        <Stack.Screen name="NotifikasiScreen" component={NotifikasiScreen} />
        <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />

        <Stack.Screen name="PusatBantuanScreen" component={PusatBantuanScreen} />

        <Stack.Screen name="LazadaOauthScreen" component={LazadaOauthScreen} />




        {/* HOME SEKARANG PAKAI BOTTOM TABS */}
        <Stack.Screen name="Home" component={BottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}