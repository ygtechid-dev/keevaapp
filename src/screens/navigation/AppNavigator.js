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




import HomeTab from '../tabs/HomeTab';
import TransactionTab from '../tabs/TransactionTab';
import ProfileTab from '../tabs/ProfileTab';

import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ---------- BOTTOM TABS ----------
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FF5F00',
        tabBarInactiveTintColor: '#999',

        tabBarIcon: ({ focused, color, size }) => {
          let icon = 'home-outline';

          if (route.name === 'HomeTab') icon = focused ? 'home' : 'home-outline';
          if (route.name === 'TransactionTab') icon = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          if (route.name === 'BantuanTab') icon = focused ? 'swap-horizontal' : 'swap-horizontal-outline';

          if (route.name === 'ProfileTab') icon = focused ? 'person' : 'person-outline';

          return <Ionicons name={icon} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeTab} options={{ title: "Home" }} />
      <Tab.Screen name="TransactionTab" component={TransactionTab} options={{ title: "Order" }} />
      <Tab.Screen name="BantuanTab" component={ProfileTab} options={{ title: "Bantuan" }} />
      <Tab.Screen name="ProfileTab" component={ProfileTab} options={{ title: "Saya" }} />

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

        <Stack.Screen name="KesehatanTokoScreen" component={KesehatanTokoScreen} />


        {/* HOME SEKARANG PAKAI BOTTOM TABS */}
        <Stack.Screen name="Home" component={BottomTabs} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
