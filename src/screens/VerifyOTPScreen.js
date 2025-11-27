import React, { useState, useRef, useEffect } from 'react';
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

export default function VerifyOTPScreen({ navigation, route }) {
  const { phone, otp, originalPhone } = route.params;
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all fields filled
    if (index === 5 && text) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        verifyOTP(fullCode);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (enteredCode) => {
    const fullCode = enteredCode || code.join('');
    
    if (fullCode.length !== 6) {
      alert('Error', 'Masukkan 6 digit kode OTP');
      return;
    }

    setLoading(true);

    try {
      // Verify OTP
      if (fullCode === otp) {
          navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
      } else {
        alert('Error', 'Kode OTP tidak valid');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error', 'Terjadi kesalahan saat verifikasi');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setResendLoading(true);

    try {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': 'ScSuD6CbrZakniT79zut',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: phone,
          message: `Kode OTP KEEVA Anda adalah: *${newOtp}*\n\nJangan bagikan kode ini kepada siapapun.\n\nBerlaku selama 5 menit.`,
          countryCode: '62'
        })
      });

      const data = await response.json();

      if (data.status) {
        // Update OTP in route params
        navigation.setParams({ otp: newOtp });
        
        alert('Berhasil', 'Kode OTP baru telah dikirim');
        setCode(['', '', '', '', '', '']);
        setTimer(60);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      } else {
        alert('Error', data.reason || 'Gagal mengirim ulang OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Error', 'Terjadi kesalahan saat mengirim ulang OTP');
    } finally {
      setResendLoading(false);
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
        <Text style={styles.headerTitle}>Verifikasi OTP</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="mail-outline" size={60} color="#00BCD4" />
        </View>

        <Text style={styles.title}>Masukkan Kode Verifikasi</Text>
        <Text style={styles.subtitle}>
          Kami telah mengirim kode verifikasi ke WhatsApp
        </Text>
        <Text style={styles.phoneNumber}>+{phone}</Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled
              ]}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={() => verifyOTP()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Verifikasi</Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          {!canResend ? (
            <Text style={styles.timerText}>
              Kirim ulang kode dalam {timer} detik
            </Text>
          ) : (
            <TouchableOpacity
              onPress={resendOTP}
              disabled={resendLoading}
            >
              <Text style={styles.resendText}>
                {resendLoading ? 'Mengirim...' : 'Kirim Ulang Kode'}
              </Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center'
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
    paddingHorizontal: 20
  },
  phoneNumber: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginBottom: 40
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 10
  },
  otpInput: {
    width: 48,
    height: 55,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#FAFAFA'
  },
  otpInputFilled: {
    borderColor: '#00BCD4',
    backgroundColor: '#E0F7FA'
  },
  btn: {
    backgroundColor: '#00BCD4',
    padding: 16,
    borderRadius: 25,
    width: '100%',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
  resendContainer: {
    marginTop: 25,
    alignItems: 'center'
  },
  timerText: {
    fontSize: 14,
    color: '#999'
  },
  resendText: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '700'
  }
});