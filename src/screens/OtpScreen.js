import React, { useState, useRef } from 'react';
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

export default function OTPScreen({ navigation }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      alert('Masukkan 6 digit kode OTP');
      return;
    }
    navigation.navigate('RegisterScreen');
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
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Masukkan Kode OTP</Text>
        <Text style={styles.subtitle}>
          Silahkan Masukkan 6 digit kode OTP yang dikirimkan melalui whatsapp
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
          <View key={index} style={styles.otpBoxContainer}>
  <TextInput
    ref={(ref) => (inputRefs.current[index] = ref)}
    style={styles.otpInput}
    value={digit}
    onChangeText={(value) => handleOtpChange(value, index)}
    onKeyPress={(e) => handleKeyPress(e, index)}
    keyboardType="number-pad"
    maxLength={1}
  />
</View>

          ))}
        </View>

        {/* Resend Link */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Tidak menerima kode OTP? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Kirim Ulang</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={handleConfirm}
        >
          <Text style={styles.btnText}>Konfirmasi</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 14,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 26,
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 15,
    lineHeight: 32
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
       fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 22,
    marginBottom: 24,
    marginTop: -10,
    maxWidth: '80%'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginLeft: -5,
  },
otpBoxContainer: {
  width: 52,
  height: 56,
  borderWidth: 1,
  borderColor: '#5DCBAD',
  borderRadius: 18,
  marginLeft: 3,
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
},

otpInput: {
  fontSize: 24,
  fontFamily: 'Poppins-SemiBold',
  color: '#000',
  paddingVertical: 5,
  paddingHorizontal: 14,
  textAlign: 'center'
},


  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resendText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins-Regular'
  },
  resendLink: {
    fontSize: 13,
    color: '#5DCBAD',
    fontFamily: 'Poppins-SemiBold'
  },
  footer: {
    padding: 20,
    paddingBottom: 30
  },
  btn: { 
    backgroundColor: '#5DCBAD', 
    padding: 11, 
    height: 52,
    borderRadius: 12,
    shadowColor: '#4FD1C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  btnText: { 
    color: 'white', 
    textAlign: 'center', 
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  }
});