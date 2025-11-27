import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Color Palette
const COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FF9800',
  purple: '#667eea',
  
  dark: '#1A1A1A',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  
  background: '#F5F7FA',
  white: '#FFFFFF',
  
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

export default function BantuanTab({ navigation }) {
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ Data
  const faqCategories = [
    {
      id: 'umum',
      title: 'Pertanyaan Umum',
      icon: 'help-circle-outline',
      color: COLORS.primary,
      count: 12
    },
    {
      id: 'klaim',
      title: 'Klaim Paket',
      icon: 'cube-outline',
      color: COLORS.warning,
      count: 8
    },
    {
      id: 'pembayaran',
      title: 'Pembayaran',
      icon: 'card-outline',
      color: COLORS.success,
      count: 6
    },
    {
      id: 'akun',
      title: 'Akun & Keamanan',
      icon: 'shield-checkmark-outline',
      color: COLORS.danger,
      count: 5
    },
  ];

  const faqItems = [
    {
      id: 1,
      category: 'umum',
      question: 'Bagaimana cara menggunakan aplikasi ini?',
      answer: 'Anda dapat memulai dengan membuat akun, menghubungkan toko marketplace Anda, dan mulai melakukan monitoring pesanan serta mengajukan klaim jika diperlukan.'
    },
    {
      id: 2,
      category: 'klaim',
      question: 'Berapa lama proses klaim paket hilang?',
      answer: 'Proses klaim biasanya memakan waktu 3-5 hari kerja. Anda dapat memantau status klaim di menu Monitoring Klaim.'
    },
    {
      id: 3,
      category: 'klaim',
      question: 'Apa saja syarat mengajukan klaim?',
      answer: 'Anda perlu menyertakan Order ID, Nomor Resi, dan bukti pengiriman. Pastikan paket sudah melewati batas SLA yang ditentukan.'
    },
    {
      id: 4,
      category: 'pembayaran',
      question: 'Bagaimana cara upgrade ke PRO?',
      answer: 'Klik tombol Upgrade PRO di halaman utama atau profil. Pilih paket langganan dan lakukan pembayaran.'
    },
    {
      id: 5,
      category: 'akun',
      question: 'Bagaimana cara mengganti password?',
      answer: 'Buka menu Akun Saya > Ganti Password. Masukkan password lama dan password baru Anda.'
    },
  ];

  // Ticket Categories
  const ticketCategories = [
    { id: 'teknis', label: 'Masalah Teknis', icon: 'bug-outline' },
    { id: 'klaim', label: 'Pertanyaan Klaim', icon: 'cube-outline' },
    { id: 'billing', label: 'Billing & Pembayaran', icon: 'card-outline' },
    { id: 'fitur', label: 'Request Fitur', icon: 'bulb-outline' },
    { id: 'lainnya', label: 'Lainnya', icon: 'chatbox-ellipses-outline' },
  ];

  // Dummy Tickets
  const [myTickets, setMyTickets] = useState([
    {
      id: 'TKT-001',
      subject: 'Tidak bisa login ke akun',
      category: 'teknis',
      status: 'open',
      statusText: 'Menunggu Respons',
      date: '2025-11-15',
      lastUpdate: '2 jam yang lalu'
    },
    {
      id: 'TKT-002',
      subject: 'Cara mengajukan klaim selisih ongkir',
      category: 'klaim',
      status: 'replied',
      statusText: 'Ada Balasan',
      date: '2025-11-14',
      lastUpdate: '1 hari yang lalu'
    },
    {
      id: 'TKT-003',
      subject: 'Tagihan PRO tidak sesuai',
      category: 'billing',
      status: 'closed',
      statusText: 'Selesai',
      date: '2025-11-10',
      lastUpdate: '5 hari yang lalu'
    },
  ]);

  const handleCreateTicket = () => {
    if (!selectedCategory || !ticketSubject || !ticketDescription) {
      Alert.alert('Error', 'Mohon lengkapi semua field');
      return;
    }

    Alert.alert(
      'Tiket Berhasil Dibuat',
      'Tim support kami akan segera merespons tiket Anda. Cek status tiket di tab "Tiket Saya".',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowCreateTicket(false);
            setSelectedCategory('');
            setTicketSubject('');
            setTicketDescription('');
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return COLORS.warning;
      case 'replied': return COLORS.primary;
      case 'closed': return COLORS.success;
      default: return COLORS.textMuted;
    }
  };

  const filteredFAQ = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Icon name="help-buoy" size={60} color={COLORS.primary} />
          <Text style={styles.heroTitle}>Ada yang bisa kami bantu?</Text>
          <Text style={styles.heroSubtitle}>
            Temukan jawaban atau hubungi tim support kami
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => setShowCreateTicket(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + '15' }]}>
              <Icon name="add-circle" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.actionTitle}>Buat Tiket</Text>
            <Text style={styles.actionSubtitle}>Support langsung</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('Chat Support', 'Fitur live chat akan segera tersedia')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.success + '15' }]}>
              <Icon name="chatbubbles" size={32} color={COLORS.success} />
            </View>
            <Text style={styles.actionTitle}>Live Chat</Text>
            <Text style={styles.actionSubtitle}>Respons cepat</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Icon name="search-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari pertanyaan..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAQ Categories */}
        {!searchQuery && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kategori Bantuan</Text>
            </View>

            <View style={styles.categoriesGrid}>
              {faqCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  activeOpacity={0.7}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '15' }]}>
                    <Icon name={category.icon} size={28} color={category.color} />
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryCount}>{category.count} artikel</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* FAQ List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Hasil Pencarian' : 'Pertanyaan Populer'}
          </Text>
        </View>

        <View style={styles.faqList}>
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((faq, index) => (
              <FAQItem key={faq.id} faq={faq} isLast={index === filteredFAQ.length - 1} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="search-outline" size={60} color={COLORS.textMuted} />
              <Text style={styles.emptyStateText}>
                Tidak ada hasil untuk "{searchQuery}"
              </Text>
            </View>
          )}
        </View>

        {/* My Tickets Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tiket Saya</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllBtn}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ticketsList}>
          {myTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={styles.ticketCard}
              activeOpacity={0.7}
            >
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketId}>#{ticket.id}</Text>
                <View style={[styles.ticketStatus, { backgroundColor: getStatusColor(ticket.status) + '15' }]}>
                  <Text style={[styles.ticketStatusText, { color: getStatusColor(ticket.status) }]}>
                    {ticket.statusText}
                  </Text>
                </View>
              </View>
              <Text style={styles.ticketSubject}>{ticket.subject}</Text>
              <View style={styles.ticketFooter}>
                <View style={styles.ticketMeta}>
                  <Icon name="calendar-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.ticketMetaText}>{ticket.date}</Text>
                </View>
                <Text style={styles.ticketLastUpdate}>{ticket.lastUpdate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Butuh Bantuan Lebih Lanjut?</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <Icon name="mail-outline" size={20} color={COLORS.primary} />
              <Text style={styles.contactText}>support@keeva.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="call-outline" size={20} color={COLORS.primary} />
              <Text style={styles.contactText}>+62 812-3456-7890</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.contactText}>Senin - Jumat, 09:00 - 17:00 WIB</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Create Ticket Modal */}
      <Modal
        visible={showCreateTicket}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateTicket(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buat Tiket Baru</Text>
              <TouchableOpacity onPress={() => setShowCreateTicket(false)}>
                <Icon name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Category Selection */}
              <Text style={styles.inputLabel}>Kategori <Text style={styles.required}>*</Text></Text>
              <View style={styles.categorySelector}>
                {ticketCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat.id && styles.categoryChipActive
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Icon 
                      name={cat.icon} 
                      size={18} 
                      color={selectedCategory === cat.id ? COLORS.white : COLORS.text} 
                    />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === cat.id && styles.categoryChipTextActive
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Subject Input */}
              <Text style={styles.inputLabel}>Subjek <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Tidak bisa login ke akun"
                placeholderTextColor={COLORS.textMuted}
                value={ticketSubject}
                onChangeText={setTicketSubject}
              />

              {/* Description Input */}
              <Text style={styles.inputLabel}>Deskripsi Masalah <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Jelaskan masalah Anda secara detail..."
                placeholderTextColor={COLORS.textMuted}
                value={ticketDescription}
                onChangeText={setTicketDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Icon name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.infoBoxText}>
                  Tim support akan merespons dalam 1x24 jam
                </Text>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreateTicket(false)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleCreateTicket}
              >
                <Icon name="send" size={18} color={COLORS.white} />
                <Text style={styles.submitButtonText}>Kirim Tiket</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// FAQ Item Component
const FAQItem = ({ faq, isLast }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.faqItem, isLast && styles.faqItemLast]}>
      <TouchableOpacity 
        style={styles.faqHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Icon 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={COLORS.textMuted} 
        />
      </TouchableOpacity>
      {expanded && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
    </View>
  );
};

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

  // Hero Section
  heroSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.white,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAllBtn: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Categories Grid
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // FAQ List
  faqList: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  faqItemLast: {
    borderBottomWidth: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 20,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 15,
    textAlign: 'center',
  },

  // Tickets List
  ticketsList: {
    paddingHorizontal: 15,
    gap: 12,
  },
  ticketCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ticketStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ticketSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketMetaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  ticketLastUpdate: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Contact Section
  contactSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  required: {
    color: COLORS.danger,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});