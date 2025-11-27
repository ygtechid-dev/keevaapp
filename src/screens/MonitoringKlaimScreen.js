import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
  purple: '#667eea',
};

// Data dummy untuk klaim
const DUMMY_CLAIMS = [
  {
    id: 'CLM001',
    orderId: 'ORD-12345678',
    namaToko: 'Toko Sejahtera',
    nomorResi: 'JNE123456789012',
    type: 'Paket Hilang',
    tanggalPengajuan: '2025-11-10',
    status: 'pending',
    statusText: 'Menunggu Verifikasi',
    estimasi: '3-5 hari kerja',
    isAutoClaim: false,
  },
  {
    id: 'CLM002',
    orderId: 'ORD-87654321',
    namaToko: 'Toko Bahagia',
    nomorResi: 'SICEPAT987654321',
    type: 'Selisih Ongkir',
    tanggalPengajuan: '2025-11-12',
    status: 'processing',
    statusText: 'Sedang Diproses',
    estimasi: '2 hari lagi',
    isAutoClaim: true,
  },
  {
    id: 'CLM003',
    orderId: 'ORD-11223344',
    namaToko: 'Toko Maju Jaya',
    nomorResi: 'TIKI567890123456',
    type: 'Paket Hilang',
    tanggalPengajuan: '2025-11-08',
    status: 'approved',
    statusText: 'Disetujui',
    estimasi: 'Selesai',
    kompensasi: 'Rp 150.000',
    isAutoClaim: true,
  },
  {
    id: 'CLM004',
    orderId: 'ORD-99887766',
    namaToko: 'Toko Cahaya',
    nomorResi: 'ANTERAJA345678901',
    type: 'Selisih Ongkir',
    tanggalPengajuan: '2025-11-14',
    status: 'rejected',
    statusText: 'Ditolak',
    alasan: 'Data tidak sesuai dengan sistem',
    isAutoClaim: false,
  },
];

export default function MonitoringKlaimScreen({ navigation }) {
  const [isPro, setIsPro] = useState(false); // Set true untuk testing PRO features
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [claims, setClaims] = useState(DUMMY_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filters = [
    { id: 'all', label: 'Semua', count: claims.length },
    { id: 'pending', label: 'Menunggu', count: claims.filter(c => c.status === 'pending').length },
    { id: 'processing', label: 'Diproses', count: claims.filter(c => c.status === 'processing').length },
    { id: 'approved', label: 'Disetujui', count: claims.filter(c => c.status === 'approved').length },
    { id: 'rejected', label: 'Ditolak', count: claims.filter(c => c.status === 'rejected').length },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulasi fetch data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'processing':
        return COLORS.primary;
      case 'approved':
        return COLORS.success;
      case 'rejected':
        return COLORS.danger;
      default:
        return COLORS.textMuted;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'sync-outline';
      case 'approved':
        return 'checkmark-circle';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle-outline';
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.nomorResi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.namaToko.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || claim.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleClaimDetail = (claim) => {
    setSelectedClaim(claim);
    setShowDetailModal(true);
  };

  const handleUpgradeToPro = () => {
    navigation.navigate('UpgradeScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monitoring Klaim</Text>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Icon name="filter-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* PRO Banner - hanya muncul jika belum PRO */}
      {!isPro && (
        <TouchableOpacity 
          style={styles.proBanner}
          onPress={handleUpgradeToPro}
          activeOpacity={0.9}
        >
          <View style={styles.proBannerLeft}>
            <View style={styles.proBannerIcon}>
              <Icon name="flash" size={24} color={COLORS.warning} />
            </View>
            <View style={styles.proBannerContent}>
              <Text style={styles.proBannerTitle}>Upgrade ke PRO</Text>
              <Text style={styles.proBannerText}>
                Auto Claim otomatis tanpa ribet!
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}

      {/* PRO Status - hanya muncul jika sudah PRO */}
      {isPro && (
        <View style={styles.proStatusBanner}>
          <View style={styles.proStatusLeft}>
            <Icon name="shield-checkmark" size={24} color={COLORS.success} />
            <View>
              <Text style={styles.proStatusTitle}>Status: PRO Member ✓</Text>
              <Text style={styles.proStatusText}>Auto Claim Aktif</Text>
            </View>
          </View>
          <View style={styles.autoClaimBadge}>
            <Icon name="flash" size={16} color={COLORS.white} />
            <Text style={styles.autoClaimBadgeText}>Auto</Text>
          </View>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari Order ID atau Nomor Resi..."
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

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterSection}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              selectedFilter === filter.id && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.id && styles.filterTabTextActive
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterBadge,
              selectedFilter === filter.id && styles.filterBadgeActive
            ]}>
              <Text style={[
                styles.filterBadgeText,
                selectedFilter === filter.id && styles.filterBadgeTextActive
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Claims List */}
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredClaims.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="document-text-outline" size={80} color={COLORS.textMuted} />
            <Text style={styles.emptyStateTitle}>Tidak Ada Klaim</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Tidak ada hasil untuk pencarian Anda' : 'Belum ada klaim yang diajukan'}
            </Text>
          </View>
        ) : (
          <View style={styles.claimsList}>
            {filteredClaims.map((claim) => (
              <TouchableOpacity
                key={claim.id}
                style={styles.claimCard}
                onPress={() => handleClaimDetail(claim)}
                activeOpacity={0.7}
              >
                {/* Auto Claim Badge */}
                {claim.isAutoClaim && isPro && (
                  <View style={styles.autoClaimLabel}>
                    <Icon name="flash" size={12} color={COLORS.white} />
                    <Text style={styles.autoClaimLabelText}>Auto Claim</Text>
                  </View>
                )}

                {/* Header Card */}
                <View style={styles.claimCardHeader}>
                  <View style={styles.claimCardHeaderLeft}>
                    <Text style={styles.claimId}>#{claim.id}</Text>
                    <View style={[styles.claimTypeBadge, { backgroundColor: claim.type === 'Paket Hilang' ? COLORS.danger + '15' : COLORS.warning + '15' }]}>
                      <Text style={[styles.claimTypeText, { color: claim.type === 'Paket Hilang' ? COLORS.danger : COLORS.warning }]}>
                        {claim.type}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(claim.status) + '15' }]}>
                    <Icon name={getStatusIcon(claim.status)} size={16} color={getStatusColor(claim.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(claim.status) }]}>
                      {claim.statusText}
                    </Text>
                  </View>
                </View>

                {/* Content Card */}
                <View style={styles.claimCardContent}>
                  <View style={styles.claimInfoRow}>
                    <Icon name="storefront-outline" size={16} color={COLORS.textMuted} />
                    <Text style={styles.claimInfoLabel}>Toko:</Text>
                    <Text style={styles.claimInfoValue}>{claim.namaToko}</Text>
                  </View>
                  <View style={styles.claimInfoRow}>
                    <Icon name="receipt-outline" size={16} color={COLORS.textMuted} />
                    <Text style={styles.claimInfoLabel}>Order ID:</Text>
                    <Text style={styles.claimInfoValue}>{claim.orderId}</Text>
                  </View>
                  <View style={styles.claimInfoRow}>
                    <Icon name="barcode-outline" size={16} color={COLORS.textMuted} />
                    <Text style={styles.claimInfoLabel}>Resi:</Text>
                    <Text style={styles.claimInfoValue}>{claim.nomorResi}</Text>
                  </View>
                </View>

                {/* Footer Card */}
                <View style={styles.claimCardFooter}>
                  <View style={styles.claimDateInfo}>
                    <Icon name="calendar-outline" size={14} color={COLORS.textMuted} />
                    <Text style={styles.claimDateText}>{claim.tanggalPengajuan}</Text>
                  </View>
                  {claim.status === 'approved' && claim.kompensasi && (
                    <View style={styles.compensationBadge}>
                      <Icon name="cash-outline" size={14} color={COLORS.success} />
                      <Text style={styles.compensationText}>{claim.kompensasi}</Text>
                    </View>
                  )}
                  {(claim.status === 'pending' || claim.status === 'processing') && (
                    <View style={styles.estimationBadge}>
                      <Icon name="time-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.estimationText}>{claim.estimasi}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Icon name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Status klaim diperbarui secara real-time. {isPro ? 'Auto Claim Anda berjalan otomatis.' : 'Upgrade ke PRO untuk Auto Claim.'}
          </Text>
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail Klaim</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedClaim && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Status Section */}
                <View style={[styles.modalStatusCard, { backgroundColor: getStatusColor(selectedClaim.status) + '15' }]}>
                  <Icon name={getStatusIcon(selectedClaim.status)} size={40} color={getStatusColor(selectedClaim.status)} />
                  <Text style={[styles.modalStatusText, { color: getStatusColor(selectedClaim.status) }]}>
                    {selectedClaim.statusText}
                  </Text>
                </View>

                {/* Detail Info */}
                <View style={styles.modalDetailSection}>
                  <Text style={styles.modalSectionTitle}>Informasi Klaim</Text>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>ID Klaim</Text>
                    <Text style={styles.modalDetailValue}>{selectedClaim.id}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Tipe Klaim</Text>
                    <Text style={styles.modalDetailValue}>{selectedClaim.type}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Nama Toko</Text>
                    <Text style={styles.modalDetailValue}>{selectedClaim.namaToko}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Order ID</Text>
                    <Text style={styles.modalDetailValue}>{selectedClaim.orderId}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Nomor Resi</Text>
                    <Text style={styles.modalDetailValue}>{selectedClaim.nomorResi}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Tanggal Pengajuan</Text>
                    <Text style={styles.modalDetailValue}>{selectedClaim.tanggalPengajuan}</Text>
                  </View>

                  {selectedClaim.isAutoClaim && isPro && (
                    <View style={styles.autoClaimInfo}>
                      <Icon name="flash" size={20} color={COLORS.purple} />
                      <Text style={styles.autoClaimInfoText}>
                        Klaim ini diproses secara otomatis
                      </Text>
                    </View>
                  )}

                  {selectedClaim.kompensasi && (
                    <View style={styles.modalDetailRow}>
                      <Text style={styles.modalDetailLabel}>Kompensasi</Text>
                      <Text style={[styles.modalDetailValue, { color: COLORS.success, fontWeight: '700' }]}>
                        {selectedClaim.kompensasi}
                      </Text>
                    </View>
                  )}

                  {selectedClaim.alasan && (
                    <View style={styles.rejectionReason}>
                      <Text style={styles.modalSectionTitle}>Alasan Penolakan</Text>
                      <Text style={styles.rejectionReasonText}>{selectedClaim.alasan}</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={() => setShowDetailModal(false)}
              >
                <Text style={styles.modalActionButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerIconBtn: {
    padding: 4,
  },

  // PRO Banner
  proBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.purple,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  proBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  proBannerIcon: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBannerContent: {
    flex: 1,
  },
  proBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  proBannerText: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.9,
  },

  // PRO Status Banner
  proStatusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    marginHorizontal: 15,
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.success + '30',
  },
  proStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  proStatusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  proStatusText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  autoClaimBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  autoClaimBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 15,
    paddingVertical: 15,
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

  // Filter Section
  filterSection: {
    marginBottom: 15,
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  filterBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: COLORS.white + '30',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  filterBadgeTextActive: {
    color: COLORS.white,
  },

  // Claims List
  scrollContent: {
    flex: 1,
  },
  claimsList: {
    paddingHorizontal: 15,
    gap: 12,
  },
  claimCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  autoClaimLabel: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.purple,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 1,
  },
  autoClaimLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  claimCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 80,
  },
  claimCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  claimId: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  claimTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  claimTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  claimCardContent: {
    gap: 8,
    marginBottom: 12,
  },
  claimInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  claimInfoLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    width: 70,
  },
  claimInfoValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  claimCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  claimDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  claimDateText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  compensationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  compensationText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },
  estimationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  estimationText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Info Section
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
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
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
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
  },
  modalStatusCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  modalStatusText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  modalDetailSection: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalDetailLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  modalDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  autoClaimInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.purple + '15',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 10,
  },
  autoClaimInfoText: {
    fontSize: 13,
    color: COLORS.purple,
    fontWeight: '600',
    flex: 1,
  },
  rejectionReason: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.danger + '10',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  rejectionReasonText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  modalActionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
})