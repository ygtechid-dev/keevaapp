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
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

const sendOTP = async () => {
  if (!phone) {
    Alert.alert("Error", "Nomor Handphone wajib diisi");
    return;
  }

  if (phone.length < 10) {
    Alert.alert("Error", "Nomor Handphone tidak valid");
    return;
  }

  setLoading(true);

  try {
    const otp = generateOTP();

    // Normalisasi nomor
    let formattedPhone = phone
      .replace(/\D/g, "")
      .replace(/^0/, "62")
      .replace(/^(?!62)/, "62");

    console.log("Nomor yang dikirim:", formattedPhone);

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: "ScSuD6CbrZakniT79zut",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: formattedPhone,
        message: `Kode OTP Anda adalah: *${otp}*\n\nJangan bagikan kode ini kepada siapapun.\n\nBerlaku selama 5 menit.`,
        countryCode: "62",
      }),
    });

    const result = await response.json();
    console.log("Response Fonnte:", result);

    if (result.status === true) {
      // Tampilkan alert dulu
   
      // Delay sebentar biar alert sempat tampil
      setTimeout(() => {
        navigation.navigate("VerifyOTPScreen", {
          phone: formattedPhone,
          otp,
          originalPhone: phone,
        });
      }, 500);
      
    } else {
      Alert.alert("Gagal Mengirim OTP", result.reason || "Periksa nomor Anda");
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    Alert.alert("Error", "Terjadi kesalahan saat mengirim OTP");
  } finally {
    setLoading(false);
  }
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
        <View style={styles.infoBox}>
          <Icon name="shield-checkmark" size={24} color="#00BCD4" />
          <Text style={styles.infoText}>
            Kami akan mengirimkan kode verifikasi ke WhatsApp Anda
          </Text>
        </View>

        {/* Phone Input */}
        <Text style={styles.label}>Nomor Handphone</Text>
        <View style={styles.phoneInputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+62</Text>
          </View>
          <TextInput
            placeholder="8123456789"
            value={phone}
            onChangeText={(text) => {
              // Remove non-numeric characters
              const cleaned = text.replace(/[^0-9]/g, '');
              setPhone(cleaned);
            }}
            style={styles.phoneInput}
            keyboardType="phone-pad"
            maxLength={15}
            editable={!loading}
          />
        </View>

        <Text style={styles.helpText}>
          Contoh: 812345678910 (tanpa 0 di depan)
        </Text>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]} 
          onPress={sendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Kirim Kode OTP</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Belum Punya Akun? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("RegisterScreen")}
            disabled={loading}
          >
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#00695C',
    marginLeft: 12,
    lineHeight: 18
  },
  label: {
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
    fontWeight: '500'
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    backgroundColor: '#FAFAFA',
    paddingLeft: 20,
    paddingRight: 20,
  },
  countryCode: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    marginRight: 10
  },
  countryCodeText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600'
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: '#000'
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginLeft: 5
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
    marginTop: 30
  },
  btnDisabled: {
    backgroundColor: '#80DEEA',
    opacity: 0.7
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