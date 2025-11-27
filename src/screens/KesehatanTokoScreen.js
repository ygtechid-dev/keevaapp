import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

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

export default function KesehatanTokoScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('30D');
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Data untuk cards
  const summaryCards = [
    { label: 'Total Omzet', value: 'Rp 80.000.000', color: '#fff', textColor: '#000' },
    { label: 'Uang Cair', value: 'Rp 5000.000', color: '#E8F5E9', textColor: '#4CAF50' },
    { label: 'Uang Pending', value: 'Rp 3000.000', color: '#E3F2FD', textColor: '#2196F3' },
    { label: 'Margin Bersih', value: 'Rp 20.000.000', color: '#F1F8E9', textColor: '#8BC34A' },
  ];

  // Data untuk Line Chart
  const omzetData = [
    { value: 40, label: '02 Apr' },
    { value: 55, label: '06 Apr' },
    { value: 45, label: '14 Apr' },
    { value: 50, label: '13 Apr' },
    { value: 80, label: '14 Apr' },
    { value: 60, label: '18 Apr' },
    { value: 70, label: '21 Apr' },
    { value: 75, label: '23 Apr' },
  ];

  const biayaData = [
    { value: 30, label: '02 Apr' },
    { value: 35, label: '06 Apr' },
    { value: 32, label: '14 Apr' },
    { value: 38, label: '13 Apr' },
    { value: 40, label: '14 Apr' },
    { value: 35, label: '18 Apr' },
    { value: 37, label: '21 Apr' },
    { value: 42, label: '23 Apr' },
  ];

  // Data untuk Pie Chart
  const pieData = [
    { value: 20, color: '#4A90E2', text: '20%', label: 'Biaya Iklan' },
    { value: 8, color: '#E8735C', text: '8%', label: 'Biaya Admin' },
    { value: 10, color: '#50C9A5', text: '10%', label: 'Biaya Affiliate' },
    { value: 40, color: '#F5A623', text: '40%', label: 'Biaya Promo' },
    { value: 6, color: '#9013FE', text: '6%', label: 'Biaya Lain' },
    { value: 16, color: '#BD10E0', text: '16%', label: 'Lainnya' },
  ];

  // Data Pengeluaran Detail
  const pengeluaranDetail = [
    { name: 'Biaya Iklan', percentage: '20%', amount: 'Rp 16.000.000' },
    { name: 'Biaya Admin', percentage: '8%', amount: 'Rp 6.400.00' },
    { name: 'Biaya Affiliate', percentage: '1%', amount: 'Rp 3.000.00' },
    { name: 'Biaya Promo', percentage: '6%', amount: 'Rp 4.800.00' },
    { name: 'Biaya Lain-lain', percentage: '3%', amount: 'Rp 2.400.00' },
  ];

  // Data Bar Chart (Uang Cair vs Pending)
  const barData = [
    { value: 80, label: 'Uang Cair', frontColor: '#4A90E2' },
    { value: 60, label: 'Uang Pending', frontColor: '#50C9A5' },
  ];

  // Status Pengiriman & Klaim
  const statusData = [
    { name: 'Barang Hilang', amount: '3', status: 'Rp 100.000' },
    { name: 'Barang Retur', amount: '4', status: 'Rp 150.000' },
    { name: 'Selisih Ongkir', amount: '3', status: 'Rp 390.000' },
  ];

  // Detail Reports Data
  const detailReports = [
    { 
      id: 1, 
      title: 'Barang Belum Sampai', 
      icon: 'time-outline', 
      color: COLORS.warning,
      count: '12 Paket'
    },
    { 
      id: 2, 
      title: 'Barang Sudah Cair', 
      icon: 'checkmark-circle-outline', 
      color: COLORS.success,
      count: '145 Paket'
    },
    { 
      id: 3, 
      title: 'Barang Hilang', 
      icon: 'alert-circle-outline', 
      color: COLORS.danger,
      count: '3 Paket'
    },
    { 
      id: 4, 
      title: 'Selisih Ongkir', 
      icon: 'cash-outline', 
      color: COLORS.primary,
      count: 'Rp 390.000'
    },
    { 
      id: 5, 
      title: 'Laporan Keuangan', 
      icon: 'document-text-outline', 
      color: COLORS.primary,
      count: 'Lihat Detail'
    },
    { 
      id: 6, 
      title: 'Omset Harian', 
      icon: 'trending-up-outline', 
      color: COLORS.success,
      count: 'Lihat Grafik'
    },
  ];

  const claimOptions = [
    {
      id: 1,
      title: 'Klaim Paket Hilang',
      description: 'Ajukan klaim untuk paket yang hilang atau tidak sampai',
      icon: 'cube-outline',
      color: COLORS.danger,
      type: 'paket_hilang'
    },
    {
      id: 2,
      title: 'Klaim Selisih Ongkir',
      description: 'Ajukan klaim untuk selisih biaya pengiriman',
      icon: 'cash-outline',
      color: COLORS.primary,
      type: 'selisih_ongkir'
    },
  ];

  const handleClaimSelect = (type) => {
    setShowClaimModal(false);
    // Navigate to form klaim screen
    navigation.navigate('FormKlaimScreen', { claimType: type });
  };

  const handleDetailReport = (reportTitle) => {
    // Navigate to detail report screen
    navigation.navigate('DetailReportScreen', { reportType: reportTitle });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kesehatan Toko</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.cardsScroll}
        >
          {summaryCards.map((card, index) => (
            <View 
              key={index} 
              style={[styles.summaryCard, { backgroundColor: card.color }]}
            >
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={[styles.cardValue, { color: card.textColor }]}>
                {card.value}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Omzet dan Biaya Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Omzet dan Biaya</Text>
            <View style={styles.periodButtons}>
              {['7D', '30D', 'MTD'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodBtn,
                    selectedPeriod === period && styles.periodBtnActive
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodText,
                    selectedPeriod === period && styles.periodTextActive
                  ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Line Chart */}
          <View style={styles.chartContainer}>
            <LineChart
              data={omzetData}
              data2={biayaData}
              height={180}
              width={width - 60}
              spacing={40}
              initialSpacing={10}
              color1="#4A90E2"
              color2="#F5A623"
              thickness={3}
              curved
              startFillColor1="rgba(74, 144, 226, 0.2)"
              endFillColor1="rgba(74, 144, 226, 0.05)"
              startFillColor2="rgba(245, 166, 35, 0.2)"
              endFillColor2="rgba(245, 166, 35, 0.05)"
              areaChart
              hideDataPoints={false}
              dataPointsColor1="#4A90E2"
              dataPointsColor2="#F5A623"
              dataPointsRadius={4}
              xAxisColor="#E0E0E0"
              yAxisColor="#E0E0E0"
              yAxisTextStyle={{ color: '#888', fontSize: 10 }}
              xAxisLabelTextStyle={{ color: '#888', fontSize: 9 }}
              noOfSections={4}
              maxValue={100}
            />
            
            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
                <Text style={styles.legendText}>Omzet</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F5A623' }]} />
                <Text style={styles.legendText}>Biaya</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pengeluaran Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengeluaran</Text>
          
          <View style={styles.pengeluaranContainer}>
            {/* Pie Chart */}
            <View style={styles.pieChartContainer}>
              <PieChart
                data={pieData}
                radius={70}
                innerRadius={45}
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <Text style={styles.centerLabelText}>Total</Text>
                    <Text style={styles.centerLabelValue}>100%</Text>
                  </View>
                )}
              />
            </View>

            {/* Pengeluaran Details */}
            <View style={styles.pengeluaranDetails}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailHeaderText}>Nama</Text>
                <Text style={styles.detailHeaderText}>Persentage</Text>
              </View>
              {pengeluaranDetail.map((item, index) => (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailName}>{item.name}</Text>
                  <Text style={styles.detailPercentage}>{item.percentage}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Biaya</Text>
                <Text style={styles.totalValue}>Rp 38.000.000</Text>
              </View>
            </View>
          </View>

          {/* Pengeluaran Amounts */}
          <View style={styles.amountsContainer}>
            <View style={styles.amountHeader}>
              <Text style={styles.amountHeaderText}>Nama</Text>
              <Text style={styles.amountHeaderText}>Rp</Text>
            </View>
            {pengeluaranDetail.map((item, index) => (
              <View key={index} style={styles.amountRow}>
                <Text style={styles.amountName}>{item.name}</Text>
                <Text style={styles.amountValue}>{item.amount}</Text>
              </View>
            ))}
            <View style={styles.totalAmountRow}>
              <Text style={styles.totalAmountLabel}>Total Biaya</Text>
              <Text style={styles.totalAmountValue}>Rp 38.000.000</Text>
            </View>
          </View>
        </View>

        {/* Uang Cair vs Pending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uang Cair vs Pending</Text>
          
          <View style={styles.barChartContainer}>
            <View style={styles.barChart}>
              {barData.map((item, index) => (
                <View key={index} style={styles.barItem}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${item.value}%`, 
                          backgroundColor: item.frontColor 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Status Pengiriman & Klaim */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Pengiriman & Klaim</Text>
          
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Nama</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Total Barang</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Total Kerugian</Text>
            </View>
            
            {statusData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.amount}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.status}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detail Reports Grid */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lihat Selengkapnya</Text>
          
          <View style={styles.reportGrid}>
            {detailReports.map((report) => (
              <TouchableOpacity 
                key={report.id} 
                style={styles.reportCard}
                onPress={() => handleDetailReport(report.title)}
                activeOpacity={0.7}
              >
                <View style={[styles.reportIconWrapper, { backgroundColor: report.color + '15' }]}>
                  <Icon name={report.icon} size={24} color={report.color} />
                </View>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportCount}>{report.count}</Text>
                <Icon name="chevron-forward" size={18} color={COLORS.textMuted} style={styles.reportChevron} />
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button - Ajukan Klaim */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => setShowClaimModal(true)}
        activeOpacity={0.9}
      >
        <Icon name="document-text" size={24} color={COLORS.white} />
        <Text style={styles.fabText}>Ajukan Klaim</Text>
      </TouchableOpacity>

      {/* Modal Pilihan Klaim */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showClaimModal}
        onRequestClose={() => setShowClaimModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowClaimModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Jenis Klaim</Text>
              <TouchableOpacity onPress={() => setShowClaimModal(false)}>
                <Icon name="close-circle" size={28} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {claimOptions.map((option) => (
                <TouchableOpacity 
                  key={option.id}
                  style={styles.claimOption}
                  onPress={() => handleClaimSelect(option.type)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.claimIconWrapper, { backgroundColor: option.color + '15' }]}>
                    <Icon name={option.icon} size={28} color={option.color} />
                  </View>
                  <View style={styles.claimInfo}>
                    <Text style={styles.claimTitle}>{option.title}</Text>
                    <Text style={styles.claimDescription}>{option.description}</Text>
                  </View>
                  <Icon name="chevron-forward" size={24} color={COLORS.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
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
    paddingTop: 50,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Summary Cards
  cardsScroll: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  summaryCard: {
    width: 140,
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
    flexWrap: 'wrap',
  },

  // Section
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: COLORS.background,
  },
  periodBtnActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  periodTextActive: {
    color: COLORS.white,
  },

  // Chart Container
  chartContainer: {
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },

  // Pengeluaran
  pengeluaranContainer: {
    flexDirection: 'column',
    gap: 15,
    marginBottom: 15,
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  centerLabelValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  pengeluaranDetails: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  detailHeaderText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailName: {
    fontSize: 11,
    color: COLORS.text,
    flex: 1,
    paddingRight: 10,
  },
  detailPercentage: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Amounts Container
  amountsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  amountHeaderText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  amountName: {
    fontSize: 11,
    color: COLORS.text,
    flex: 1,
    paddingRight: 10,
  },
  amountValue: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  totalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  totalAmountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalAmountValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },

  // Bar Chart
  barChartContainer: {
    paddingVertical: 15,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
  },
  barItem: {
    alignItems: 'center',
    width: 90,
  },
  barWrapper: {
    height: 160,
    width: 50,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Table
  tableContainer: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.divider,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textLight,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  tableCell: {
    fontSize: 12,
    color: COLORS.text,
  },

  // Report Grid
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reportCard: {
    width: (width - 50) / 2,
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 12,
    position: 'relative',
  },
  reportIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  reportCount: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  reportChevron: {
    position: 'absolute',
    top: 15,
    right: 15,
  },

  // FAB Button
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  fabText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
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
    paddingBottom: 30,
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
    gap: 12,
  },
  claimOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  claimIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimInfo: {
    flex: 1,
  },
  claimTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  claimDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
});