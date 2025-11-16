import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const doRegister = () => {
    if (!username) {
      alert("Username wajib diisi");
      return;
    }
    if (!phone) {
      alert("Nomor Handphone wajib diisi");
      return;
    }
    if (!email) {
      alert("Email wajib diisi");
      return;
    }
    if (!password) {
      alert("Password wajib diisi");
      return;
    }
    
    // Dummy register - navigasi ke halaman hubungkan toko
    navigation.replace("StoreSelectionScreen");
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
        <Text style={styles.headerTitle}>Daftar Akun</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Username Input */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Moni Studio"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        {/* Phone Input */}
        <Text style={styles.label}>Nomor Handphone</Text>
        <TextInput
          placeholder="+62 8123 4567 8900"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={20}
        />

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="monistudio@gmail.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
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

        {/* Terms Agreement */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Dengan mendaftar, Anda menyetujui{' '}
            <Text 
              style={styles.termsLink}
              onPress={() => setModalVisible(true)}
            >
              Syarat & Ketentuan
            </Text>
            {' '}serta{' '}
            <Text 
              style={styles.termsLink}
              onPress={() => setModalVisible(true)}
            >
              Kebijakan Privasi
            </Text>
          </Text>
        </View>

        {/* Register Button */}
        <TouchableOpacity 
          style={styles.btn} 
          onPress={doRegister}
        >
          <Text style={styles.btnText}>Setuju & Lanjutkan</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Sudah Punya Akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.loginLink}>Daftar Disini</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Syarat & Ketentuan */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Syarat & Ketentuan</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>
                <Text style={styles.modalSubtitle}>1. Ketentuan Umum{'\n'}</Text>
                Dengan menggunakan aplikasi Ditokoku, Anda menyetujui untuk terikat dengan syarat dan ketentuan yang berlaku.{'\n\n'}
                
                <Text style={styles.modalSubtitle}>2. Privasi & Keamanan{'\n'}</Text>
                Kami berkomitmen untuk melindungi data pribadi Anda. Informasi yang Anda berikan akan digunakan sesuai dengan kebijakan privasi kami.{'\n\n'}
                
                <Text style={styles.modalSubtitle}>3. Penggunaan Layanan{'\n'}</Text>
                Anda bertanggung jawab penuh atas aktivitas yang dilakukan menggunakan akun Anda. Pastikan untuk menjaga kerahasiaan informasi login Anda.{'\n\n'}
                
                <Text style={styles.modalSubtitle}>4. Transaksi & Pembayaran{'\n'}</Text>
                Semua transaksi yang dilakukan melalui aplikasi ini bersifat final. Pastikan untuk memeriksa detail transaksi sebelum melakukan pembayaran.{'\n\n'}
                
                <Text style={styles.modalSubtitle}>5. Perubahan Ketentuan{'\n'}</Text>
                Kami berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi.{'\n\n'}
              </Text>
            </ScrollView>

            {/* Modal Footer */}
            <TouchableOpacity 
              style={styles.modalBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>Saya Mengerti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  termsContainer: {
    marginTop: 20,
    marginBottom: 25,
    paddingHorizontal: 5
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center'
  },
  termsLink: {
    color: '#000',
    fontWeight: '700'
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
    marginBottom: 20
  },
  btnText: { 
    color: 'white', 
    textAlign: 'center', 
    fontWeight: '600',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    alignItems: 'center'
  },
  loginText: {
    fontSize: 14,
    color: '#666'
  },
  loginLink: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700'
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000'
  },
  closeBtn: {
    padding: 5
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333'
  },
  modalSubtitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#000'
  },
  modalBtn: {
    backgroundColor: '#00BCD4',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 25,
    alignItems: 'center'
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});