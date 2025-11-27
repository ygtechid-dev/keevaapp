import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Color Palette
const COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FF9800',
  dark: '#1A1A1A',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  background: '#F5F7FA',
  white: '#FFFFFF',
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

export default function FormKlaimScreen({ route, navigation }) {
  const { claimType } = route.params;
  const [formData, setFormData] = useState({
    namaToko: '',
    orderId: '',
    nomorResi: '',
    tanggalKirim: new Date(),
    slaHabis: new Date(),
    keterangan: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState('');
  const [attachments, setAttachments] = useState([]);

  const claimTitle = claimType === 'paket_hilang' ? 'Klaim Paket Hilang' : 'Klaim Selisih Ongkir';

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, [datePickerField]: selectedDate });
    }
  };

  const openDatePicker = (field) => {
    setDatePickerField(field);
    setShowDatePicker(true);
  };

  const handleAddAttachment = () => {
    // Simulasi pemilihan file
    Alert.alert('Unggah Lampiran', 'Fitur unggah file akan segera tersedia');
    // Dalam implementasi real, gunakan react-native-document-picker atau react-native-image-picker
  };

  const handleSubmit = () => {
    // Validasi form
    if (!formData.namaToko || !formData.orderId || !formData.nomorResi || !formData.keterangan) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Proses submit
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin mengajukan klaim ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Ajukan',
          onPress: () => {
            // Kirim data ke API
            console.log('Form submitted:', formData);
            Alert.alert('Sukses', 'Klaim berhasil diajukan', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          }
        }
      ]
    );
  };

  const handleAutoClaim = () => {
    // Validasi form
    if (!formData.namaToko || !formData.orderId || !formData.nomorResi || !formData.keterangan) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Alert untuk PRO Version
    Alert.alert(
      '🌟 Fitur PRO',
      'Auto Claim adalah fitur khusus untuk pengguna PRO. Upgrade sekarang untuk menikmati pengajuan klaim otomatis tanpa perlu manual!',
      [
        { text: 'Nanti', style: 'cancel' },
        {
          text: 'Upgrade PRO',
          onPress: () => {
            // Simulasi proses auto claim untuk PRO user
            // Dalam implementasi real, cek apakah user PRO atau tidak
            // Alert.alert(
            //   'Memproses...',
            //   'Data Anda sedang dalam proses pengajuan klaim otomatis',
            //   [{ text: 'OK' }]
            // );
            navigation.navigate('UpgradeScreen')
          }
        }
      ]
    );
  };

  const handleCopyText = () => {
    // Validasi form
    if (!formData.namaToko || !formData.orderId || !formData.nomorResi || !formData.keterangan) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Format tanggal untuk text
    const tanggalKirimText = formatDate(formData.tanggalKirim);
    
    // Generate text untuk di-copy
    const claimText = `Halo kak, perkenalkan saya dari ${formData.namaToko} menginformasikan bahwa saya mau mengajukan pengajuan ${claimTitle} dengan order ID ${formData.orderId} nomor resi ${formData.nomorResi} dikirim pada tanggal ${tanggalKirimText} dan begini kronologinya ${formData.keterangan}`;

    // Copy to clipboard
    Clipboard.setString(claimText);

    // Show success message
    Alert.alert(
      'Berhasil Disalin! ✓',
      'Text pengajuan klaim sudah disalin ke clipboard. Anda bisa paste langsung ke chat customer service.',
      [{ text: 'OK' }]
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{claimTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Icon name="information-circle" size={24} color={COLORS.primary} />
          <Text style={styles.infoBannerText}>
            Pastikan data yang Anda masukkan sudah benar dan lengkap untuk mempercepat proses klaim
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Nama Toko */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Nama Toko <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Icon name="storefront-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama toko"
                placeholderTextColor={COLORS.textMuted}
                value={formData.namaToko}
                onChangeText={(value) => handleInputChange('namaToko', value)}
              />
            </View>
          </View>

          {/* Order ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Order ID <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Icon name="receipt-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contoh: ORD-12345678"
                placeholderTextColor={COLORS.textMuted}
                value={formData.orderId}
                onChangeText={(value) => handleInputChange('orderId', value)}
              />
            </View>
          </View>

          {/* Nomor Resi */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Nomor Resi <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Icon name="barcode-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan nomor resi pengiriman"
                placeholderTextColor={COLORS.textMuted}
                value={formData.nomorResi}
                onChangeText={(value) => handleInputChange('nomorResi', value)}
              />
            </View>
          </View>

          {/* Tanggal Kirim */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Tanggal Kirim <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => openDatePicker('tanggalKirim')}
            >
              <Icon name="calendar-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <Text style={styles.dateText}>{formatDate(formData.tanggalKirim)}</Text>
              <Icon name="chevron-down" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* SLA Habis */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              SLA Habis <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => openDatePicker('slaHabis')}
            >
              <Icon name="time-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
              <Text style={styles.dateText}>{formatDate(formData.slaHabis)}</Text>
              <Icon name="chevron-down" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
            <Text style={styles.helperText}>
              Batas waktu pengiriman sesuai perjanjian
            </Text>
          </View>

          {/* Keterangan/Kronologi */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Keterangan/Kronologi <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, styles.textareaWrapper]}>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Jelaskan kronologi kejadian secara detail..."
                placeholderTextColor={COLORS.textMuted}
                value={formData.keterangan}
                onChangeText={(value) => handleInputChange('keterangan', value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
            <Text style={styles.helperText}>
              Min. 50 karakter • {formData.keterangan.length} karakter
            </Text>
          </View>

          {/* Unggah Lampiran */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Unggah Lampiran</Text>
            <Text style={styles.helperText}>
              Upload foto/dokumen pendukung (Max 5 file, 2MB per file)
            </Text>

            {/* Attachment List */}
            {attachments.length > 0 && (
              <View style={styles.attachmentList}>
                {attachments.map((file, index) => (
                  <View key={index} style={styles.attachmentItem}>
                    <Icon name="document-attach" size={20} color={COLORS.primary} />
                    <Text style={styles.attachmentName}>{file.name}</Text>
                    <TouchableOpacity 
                      onPress={() => {
                        const newAttachments = attachments.filter((_, i) => i !== index);
                        setAttachments(newAttachments);
                      }}
                    >
                      <Icon name="close-circle" size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Upload Button */}
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleAddAttachment}
            >
              <Icon name="cloud-upload-outline" size={24} color={COLORS.primary} />
              <Text style={styles.uploadButtonText}>Pilih File</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon name="alert-circle-outline" size={20} color={COLORS.warning} />
            <View style={styles.infoBoxContent}>
              <Text style={styles.infoBoxTitle}>Catatan Penting:</Text>
              <Text style={styles.infoBoxText}>
                • Klaim akan diproses dalam 3-5 hari kerja{'\n'}
                • Pastikan semua data yang diinput sudah benar{'\n'}
                • Upload bukti pendukung untuk mempercepat proses{'\n'}
                • Status klaim dapat dilihat di menu Monitoring Klaim
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        {/* Auto Claim Button - PRO */}
        <TouchableOpacity 
          style={styles.autoClaimButton}
          onPress={handleAutoClaim}
          activeOpacity={0.8}
        >
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
          <Icon name="flash" size={20} color={COLORS.white} />
          <Text style={styles.autoClaimButtonText}>Auto Claim</Text>
        </TouchableOpacity>

        {/* Row dengan 2 button */}
        <View style={styles.buttonRow}>
          {/* Salin Text Button */}
         

          {/* Ajukan Klaim Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleCopyText}
            activeOpacity={0.8}
          >
            <Icon name="send" size={20} color={COLORS.white} />
            <Text style={styles.submitButtonText}>Ajukan Klaim</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={formData[datePickerField]}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollContent: {
    flex: 1,
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary + '15',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },

  // Form Section
  formSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: COLORS.danger,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  textareaWrapper: {
    alignItems: 'flex-start',
  },
  textarea: {
    height: 120,
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },

  // Date Input
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 10,
  },

  // Upload Button
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    paddingVertical: 20,
    gap: 10,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Attachment List
  attachmentList: {
    marginBottom: 12,
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  attachmentName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.warning + '10',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    gap: 12,
    marginTop: 10,
  },
  infoBoxContent: {
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  infoBoxText: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  // Bottom Bar
  bottomBar: {
    backgroundColor: COLORS.white,
    padding: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
    gap: 10,
  },
  autoClaimButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
    position: 'relative',
  },
  proBadge: {
    position: 'absolute',
    top: -8,
    right: 15,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  autoClaimButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
});