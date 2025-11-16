import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const doLogin = () => {
    if (!phone) {
      alert("Nomor Handphone wajib diisi");
      return;
    }
    if (!password) {
      alert("Password wajib diisi");
      return;
    }
    
    // Dummy login - navigasi ke halaman toko
    navigation.replace("Home");
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
        <Text style={styles.headerTitle}>Masuk</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Phone Input */}
        <Text style={styles.label}>Nomor Handphone</Text>
        <TextInput
          placeholder="082343243243243"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={15}
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="••••••"
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
          style={styles.btn} 
          onPress={doLogin}
        >
          <Text style={styles.btnText}>Masuk</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Belum Punya Akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
            <Text style={styles.registerLink}>Daftar Disini</Text>
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
    borderRadius: 25,
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
    borderRadius: 25,
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
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 25
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500'
  },
  btn: { 
    backgroundColor: '#00BCD4', 
    padding: 16, 
    borderRadius: 25,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10
  },
  btnText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: '600',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center'
  },
  registerText: {
    fontSize: 14,
    color: '#666'
  },
  registerLink: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700'
  }
});