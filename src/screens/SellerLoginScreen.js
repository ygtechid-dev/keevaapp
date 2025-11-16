import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SellerLoginScreen({ navigation, route }) {
  const { marketplace } = route.params;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Konfigurasi untuk setiap marketplace
  const marketplaceConfig = {
    'Shopee': {
      icon: require('../assets/shopee.png'),
      color: '#EE4D2D',
      title: 'Login Shopee Seller',
      placeholder: 'Email / Username / No. HP'
    },
    'TikTok Shop': {
      icon: require('../assets/tiktok.jpg'),
      color: '#000000',
      title: 'Login TikTok Shop Seller',
      placeholder: 'Email / Username / No. HP'
    },
    'Tokopedia': {
      icon: require('../assets/tokopedia.png'),
      color: '#42B549',
      title: 'Login Tokopedia Seller',
      placeholder: 'Email / Username / No. HP'
    }
  };

  const config = marketplaceConfig[marketplace];

  const handleLogin = () => {
    if (!username) {
      Alert.alert("Error", "Username/Email/No. HP wajib diisi");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Password wajib diisi");
      return;
    }

    // Dummy login - simulasi berhasil
    Alert.alert(
      "Berhasil!", 
      `Akun ${marketplace} berhasil terhubung!\n\nSekarang kamu bisa mengelola toko ${marketplace} kamu.`,
      [
        {
          text: "OK",
          onPress: () => {
            // Kembali ke halaman store selection untuk bisa hubungkan akun lain
          navigation.push('Home')
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hubungkan Akun</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Marketplace Info */}
        <View style={styles.marketplaceInfo}>
          <View style={[styles.iconContainer, { backgroundColor: config.color + '15' }]}>
            <Image 
              source={config.icon} 
              style={styles.marketplaceIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.marketplaceTitle}>{config.title}</Text>
          <Text style={styles.marketplaceSubtitle}>
            Masukkan kredensial akun seller {marketplace} kamu
          </Text>
        </View>

        {/* Username/Email Input */}
        <Text style={styles.label}>Username / Email / No. HP</Text>
        <TextInput
          placeholder={config.placeholder}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Icon 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={24} 
              color="#999" 
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: config.color }]} 
          onPress={handleLogin}
        >
          <Text style={styles.btnText}>Hubungkan Akun {marketplace}</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Icon name="shield-checkmark-outline" size={20} color={config.color} />
          <Text style={styles.infoText}>
            Data login kamu tersimpan dengan aman dan terenkripsi
          </Text>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Belum punya akun seller?</Text>
          <TouchableOpacity>
            <Text style={[styles.helpLink, { color: config.color }]}>
              Pelajari cara daftar {marketplace} Seller →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backBtn: {
    padding: 5
  },
  headerTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 30
  },
  marketplaceInfo: {
    alignItems: 'center',
    marginBottom: 40
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  marketplaceIcon: {
    width: 50,
    height: 50
  },
  marketplaceTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8
  },
  marketplaceSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  label: {
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
    marginTop: 15,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#FAFAFA'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA'
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: '#000'
  },
  eyeIcon: {
    padding: 5
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 25
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  btn: { 
    padding: 16, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20
  },
  btnText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: '600',
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    gap: 10,
    marginBottom: 30
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18
  },
  helpSection: {
    alignItems: 'center',
    marginTop: 10
  },
  helpTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  helpLink: {
    fontSize: 14,
    fontWeight: '600'
  }
});