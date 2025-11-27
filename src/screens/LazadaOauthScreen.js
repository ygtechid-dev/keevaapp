import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../context/APIUrl';

const COLORS = {
  primary: '#0F146D',
  success: '#4CAF50',
  danger: '#F44336',
  text: '#333333',
  textLight: '#666666',
  background: '#F5F7FA',
  white: '#FFFFFF',
};

export default function LazadaOAuthScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Lazada OAuth Configuration
  const LAZADA_CLIENT_ID = '135763';
  const REDIRECT_URI = 'https://api.keeva.id/api/callback';
  const LAZADA_AUTH_URL = `https://auth.lazada.com/oauth/authorize?response_type=code&redirect_uri=${REDIRECT_URI}&client_id=${LAZADA_CLIENT_ID}`;

  useEffect(() => {
    console.log('🔐 Lazada OAuth Screen loaded');
    console.log('Auth URL:', LAZADA_AUTH_URL);
  }, []);

  // Handle navigation state change dari WebView
  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;
    
    console.log('📍 Navigation URL:', url);

    // Check jika redirect ke callback URL
    if (url.includes(REDIRECT_URI)) {
      console.log('✅ Callback URL detected');
      
      // Extract code dari URL
      const codeMatch = url.match(/code=([^&]+)/);
      
      if (codeMatch && codeMatch[1]) {
        const code = codeMatch[1];
        console.log('🔑 Authorization Code:', code);
        
        // Stop WebView dari loading
        setIsLoading(false);
        
        // Exchange code untuk access token
        await exchangeCodeForToken(code);
      }
    }
  };

  // Exchange authorization code untuk access token
  const exchangeCodeForToken = async (code) => {
    try {
      setIsProcessing(true);

      console.log('🔄 Exchanging code for token...');

      const response = await axios.post(`${API_URL}/api/lazada/token`, {
        code: code,
      });

      console.log('📥 Token Response:', response.data);

      if (response.data.success && response.data.data) {
        const tokenData = response.data.data;

        // Save token ke AsyncStorage
        await saveTokenToStorage(tokenData);

        // Save ke database (optional)
        await saveTokenToDatabase(tokenData);

        Alert.alert(
          'Berhasil!',
          'Akun Lazada berhasil dihubungkan',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      console.error('❌ Token exchange error:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Gagal menghubungkan akun Lazada';
      
      Alert.alert(
        'Error',
        errorMessage,
        [
          {
            text: 'Coba Lagi',
            onPress: () => setIsLoading(true),
          },
          {
            text: 'Batal',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Save token ke AsyncStorage
  const saveTokenToStorage = async (tokenData) => {
    try {
      const lazadaToken = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        refresh_expires_in: tokenData.refresh_expires_in,
        created_at: Date.now(),
      };

      await AsyncStorage.setItem('lazada_token', JSON.stringify(lazadaToken));
      console.log('✅ Token saved to AsyncStorage', lazadaToken);
    } catch (error) {
      console.error('❌ Error saving token:', error);
    }
  };

  // Save token ke database
  const saveTokenToDatabase = async (tokenData) => {
    try {
      const userJson = await AsyncStorage.getItem('userData');
      if (!userJson) {
        console.log('⚠️ No user data found');
        return;
      }

      const userObj = JSON.parse(userJson);

      // Call API untuk save token
      const response = await axios.post(`${API_URL}/api/lazada/save-token`, {
        user_id: userObj.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        refresh_expires_in: tokenData.refresh_expires_in,
      });

      console.log('✅ Token saved to database:', response.data);
    } catch (error) {
      console.error('❌ Error saving token to DB:', error);
    }
  };

  // Handle error dari WebView
  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('❌ WebView error:', nativeEvent);
    
    setError('Gagal memuat halaman. Periksa koneksi internet Anda.');
    setIsLoading(false);
  };

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hubungkan Lazada</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.processingText}>Menghubungkan akun Lazada...</Text>
          <Text style={styles.processingSubtext}>Mohon tunggu sebentar</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hubungkan Lazada</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
            }}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hubungkan Lazada</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: LAZADA_AUTH_URL }}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleWebViewError}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Memuat...</Text>
          </View>
        )}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textLight,
    fontFamily: 'Poppins-Regular',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  processingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  processingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    fontFamily: 'Poppins-SemiBold',
  },
});