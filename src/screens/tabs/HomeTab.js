import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Color Palette - Simplified & Consistent
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
  card: '#FFFFFF',
  
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

// Simple Custom Candlestick Component
const Candle = ({ open, high, low, close, maxValue, time, onPress }) => {
  const isPositive = close >= open;
  const color = isPositive ? COLORS.success : COLORS.danger;
  
  const scale = 160;
  const normalize = (val) => (val / maxValue) * scale;
  
  const bodyTop = normalize(Math.max(open, close));
  const bodyBottom = normalize(Math.min(open, close));
  const bodyHeight = Math.abs(bodyTop - bodyBottom) || 3;
  const wickTop = normalize(high);
  const wickBottom = normalize(low);
  
  return (
    <TouchableOpacity 
      style={styles.candleWrapper}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.candleContainer}>
        <View style={[styles.wick, { 
          height: Math.abs(wickTop - bodyTop),
          backgroundColor: color 
        }]} />
        
        <View style={[styles.candleBody, { 
          height: bodyHeight,
          backgroundColor: color,
          borderColor: color,
          opacity: isPositive ? 1 : 0.7
        }]} />
        
        <View style={[styles.wick, { 
          height: Math.abs(bodyBottom - wickBottom),
          backgroundColor: color 
        }]} />
      </View>
      
      <Text style={styles.timeLabel}>{time}</Text>
    </TouchableOpacity>
  );
};

export default function HomeTab({ navigation }) {
  const [selectedCandle, setSelectedCandle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPro, setIsPro] = useState(false); // Set true untuk testing PRO

  const candleData = [
    { open: 30, high: 50, low: 25, close: 45, time: '08:00', omset: 'Rp2.500.000' },
    { open: 45, high: 65, low: 40, close: 60, time: '08:10', omset: 'Rp3.200.000' },
    { open: 60, high: 75, low: 55, close: 70, time: '08:20', omset: 'Rp4.100.000' },
    { open: 70, high: 85, low: 65, close: 80, time: '08:30', omset: 'Rp5.300.000' },
    { open: 80, high: 95, low: 75, close: 90, time: '08:40', omset: 'Rp6.800.000' },
    { open: 90, high: 100, low: 85, close: 95, time: '08:50', omset: 'Rp7.200.000' },
    { open: 95, high: 105, low: 90, close: 100, time: '09:00', omset: 'Rp8.500.000' },
    { open: 100, high: 110, low: 95, close: 105, time: '09:10', omset: 'Rp9.100.000' },
    { open: 105, high: 85, low: 75, close: 80, time: '09:20', omset: 'Rp4.800.000' },
    { open: 80, high: 90, low: 70, close: 75, time: '09:30', omset: 'Rp3.900.000' },
    { open: 75, high: 95, low: 70, close: 90, time: '09:40', omset: 'Rp5.700.000' },
    { open: 90, high: 110, low: 85, close: 105, time: '09:50', omset: 'Rp8.900.000' },
  ];

  const maxValue = Math.max(...candleData.flatMap(c => [c.high]));

  const quickMenus = [
    { id: 1, icon: 'receipt-outline', label: 'Pesanan', path: 'LaporanPesananScreen' },
    { id: 2, icon: 'document-text-outline', label: 'Laporan\nPenjualan', path: 'LaporanPenjualanScreen' },
    { id: 3, icon: 'trending-up-outline', label: 'Monitoring\nKlaim', path: 'MonitoringKlaimScreen' },
    { id: 4, icon: 'wallet-outline', label: 'Laporan\nKeuangan', path: 'LaporanKeuanganDashboard' },
  ];

  const storeHealth = [
    {
      id: 1,
      icon: 'arrow-up-circle',
      title: 'Uang Cair',
      amount: 'Rp10.000.234',
      percentage: '+45%',
      subtitle: 'dari bulan sebelumnya',
      trend: 'up',
      type: 'success'
    },
    {
      id: 2,
      icon: 'arrow-down-circle',
      title: 'Selisih Ongkir',
      amount: 'Rp190.000',
      percentage: 'Selisih',
      subtitle: '',
      trend: 'down',
      type: 'danger'
    },
    {
      id: 3,
      icon: 'alert-circle',
      title: 'Retur Belum Sampai',
      amount: '10',
      percentage: 'Paket Bermasalah',
      subtitle: '',
      trend: 'down',
      type: 'danger'
    }
  ];

  const recentOrders = [
    { id: 1, name: 'Mainan X', payment: 'Transfer BCA', status: 'Menunggu Cair', type: 'info' },
    { id: 2, name: 'Mainan Z', payment: 'Paylater', status: 'Menunggu Cair', type: 'info' },
    { id: 3, name: 'Toy Story Z', payment: 'Transfer BRI', status: 'Persiapan Dikirim', type: 'warning' },
    { id: 4, name: 'Mainan B', payment: 'Paylater', status: 'Canceled', type: 'danger' },
    { id: 5, name: 'Mainan A', payment: 'Paylater', status: 'Persiapan Dikirim', type: 'warning' },
  ];

  const getStatusColor = (type) => {
    switch(type) {
      case 'success': return COLORS.success;
      case 'danger': return COLORS.danger;
      case 'warning': return COLORS.warning;
      case 'info': return COLORS.primary;
      default: return COLORS.text;
    }
  };

  const renderTrendChart = (trend) => {
    if (trend === 'up') {
      return (
        <View style={styles.miniChart}>
          <Icon name="trending-up" size={40} color={COLORS.success} />
        </View>
      );
    } else {
      return (
        <View style={styles.miniChart}>
          <Icon name="trending-down" size={40} color={COLORS.danger} />
        </View>
      );
    }
  };

  const handleUpgradeToPro = () => {
    navigation.navigate('UpgradeScreen');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header with PRO Button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Halo, Yogi 👋</Text>
          <View style={styles.healthStatusContainer}>
            <Text style={styles.subGreeting}>Kesehatan Toko: </Text>
            <Text style={styles.healthStatus}>Kurang Baik</Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          {/* Notification Button */}
          <TouchableOpacity style={styles.notificationBtn} onPress={() => navigation.push('NotifikasiScreen')}>
            <View style={styles.notificationBadge} />
            <Icon name="notifications-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          {/* PRO Button */}
          {!isPro ? (
            <TouchableOpacity 
              style={styles.upgradeBtn}
              onPress={handleUpgradeToPro}
              activeOpacity={0.8}
            >
              <View style={styles.upgradeBtnGradient}>
                <Icon name="flash" size={18} color={COLORS.white} />
                <Text style={styles.upgradeBtnText}>PRO</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.proActiveBadge}>
              <Icon name="shield-checkmark" size={18} color={COLORS.success} />
              <Text style={styles.proActiveText}>PRO</Text>
            </View>
          )}
        </View>
      </View>

      {/* PRO Banner - Only show if not PRO */}
      {!isPro && (
        <TouchableOpacity 
          style={styles.proBanner}
          onPress={handleUpgradeToPro}
          activeOpacity={0.9}
        >
          <View style={styles.proBannerContent}>
            <View style={styles.proBannerLeft}>
              <View style={styles.proBannerIconWrapper}>
                <Icon name="flash" size={28} color={COLORS.warning} />
              </View>
              <View style={styles.proBannerTextContainer}>
                <Text style={styles.proBannerTitle}>Upgrade ke PRO</Text>
                <Text style={styles.proBannerSubtitle}>
                  Auto Claim & Fitur Premium Lainnya!
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={24} color={COLORS.white} />
          </View>
          
          {/* Decorative Elements */}
          <View style={styles.proBannerDecor1} />
          <View style={styles.proBannerDecor2} />
        </TouchableOpacity>
      )}

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartLabel}>Omset Hari Ini</Text>
            <Text style={styles.chartValue}>Rp 23.000.000</Text>
          </View>
          <View style={styles.chartControls}>
            <TouchableOpacity style={[styles.chartBtn, styles.chartBtnActive]}>
              <Text style={[styles.chartBtnText, styles.chartBtnTextActive]}>1D</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chartBtn}>
              <Text style={styles.chartBtnText}>1W</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.chartBtn}>
              <Text style={styles.chartBtnText}>1M</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Candlestick Chart */}
        <View style={styles.chartWrapper}>
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>110K</Text>
            <Text style={styles.yAxisLabel}>90K</Text>
            <Text style={styles.yAxisLabel}>70K</Text>
            <Text style={styles.yAxisLabel}>50K</Text>
            <Text style={styles.yAxisLabel}>30K</Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.chartScroll}
          >
            <View>
              <View style={styles.gridContainer}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.gridLine} />
                ))}
              </View>

              <View style={styles.candlesRow}>
                {candleData.map((candle, index) => (
                  <Candle
                    key={index}
                    open={candle.open}
                    high={candle.high}
                    low={candle.low}
                    close={candle.close}
                    time={candle.time}
                    maxValue={maxValue}
                    onPress={() => {
                      setSelectedCandle(candle);
                      setModalVisible(true);
                    }}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Quick Menu */}
      <View style={styles.quickMenuContainer}>
        {quickMenus.map((menu) => (
          <TouchableOpacity 
            key={menu.id} 
            style={styles.quickMenuItem} 
            onPress={() => navigation.push(menu.path)}
            activeOpacity={0.7}
          >
            <View style={styles.quickMenuIcon}>
              <Icon name={menu.icon} size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickMenuLabel}>{menu.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Kesehatan Toko Section */}
      {/* <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Kesehatan Toko</Text>
        <TouchableOpacity onPress={() => navigation.navigate('KesehatanTokoScreen')}>
          <Text style={styles.seeMoreBtn}>Lebih Lengkap →</Text>
        </TouchableOpacity>
      </View> */}

      {/* {storeHealth.map((item) => (
        <View key={item.id} style={styles.healthCard}>
          <View style={styles.healthCardLeft}>
            <View style={[styles.healthIconWrapper, { backgroundColor: getStatusColor(item.type) + '15' }]}>
              <Icon name={item.icon} size={24} color={getStatusColor(item.type)} />
            </View>
            <View style={styles.healthInfo}>
              <Text style={styles.healthTitle}>{item.title}</Text>
              <Text style={styles.healthAmount}>{item.amount}</Text>
              <Text style={[styles.healthPercentage, { color: getStatusColor(item.type) }]}>
                {item.percentage} {item.subtitle}
              </Text>
            </View>
          </View>
          <View style={styles.healthCardRight}>
            {renderTrendChart(item.trend)}
            <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
          </View>
        </View>
      ))} */}

      {/* Pesanan Terbaru Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pesanan Terbaru</Text>
        <TouchableOpacity onPress={() => navigation.push('LaporanPesananScreen')}>
          <Text style={styles.seeMoreBtn}>Lebih Lengkap →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.orderTableContainer}>
        <View style={styles.orderTableHeader}>
          <View style={styles.orderHeaderLeft}>
            <Text style={styles.orderTableHeaderText}>Order</Text>
          </View>
          <View style={styles.orderHeaderRight}>
            <Text style={styles.orderTableHeaderText}>Hari Ini ▼</Text>
          </View>
        </View>

        <View style={styles.orderTableSubHeader}>
          <Text style={[styles.orderTableSubHeaderText, { flex: 1.2 }]}>Nama Produk</Text>
          <Text style={[styles.orderTableSubHeaderText, { flex: 1 }]}>Metode Bayar</Text>
          <Text style={[styles.orderTableSubHeaderText, { flex: 1 }]}>Status</Text>
        </View>

        {recentOrders.map((order) => (
          <View key={order.id} style={styles.orderRow}>
            <Text style={[styles.orderCell, { flex: 1.2 }]}>{order.name}</Text>
            <Text style={[styles.orderCell, { flex: 1 }]}>{order.payment}</Text>
            <View style={{ flex: 1 }}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.type) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(order.type) }]}>
                  {order.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 30 }} />

      {/* Modal Detail Candle */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detail Omset</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close-circle" size={28} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {selectedCandle && (
              <View style={styles.modalBody}>
                <View style={styles.modalRow}>
                  <Icon name="time-outline" size={24} color={COLORS.primary} />
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalLabel}>Waktu</Text>
                    <Text style={styles.modalValue}>{selectedCandle.time}</Text>
                  </View>
                </View>

                <View style={styles.modalDivider} />

                <View style={styles.priceGrid}>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Sebelumnya</Text>
                    <Text style={styles.priceValue}>Rp{selectedCandle.open}K</Text>
                  </View>
                
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Omset Saat Ini</Text>
                    <Text style={styles.priceValue}>Rp{selectedCandle.close}K</Text>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <View style={[
                    styles.trendBadge, 
                    { backgroundColor: selectedCandle.close >= selectedCandle.open ? COLORS.success + '15' : COLORS.danger + '15' }
                  ]}>
                    <Icon 
                      name={selectedCandle.close >= selectedCandle.open ? "trending-up" : "trending-down"} 
                      size={20} 
                      color={selectedCandle.close >= selectedCandle.open ? COLORS.success : COLORS.danger} 
                    />
                    <Text style={[
                      styles.trendText,
                      { color: selectedCandle.close >= selectedCandle.open ? COLORS.success : COLORS.danger }
                    ]}>
                      {selectedCandle.close >= selectedCandle.open ? 'Naik' : 'Turun'} {' '}
                      {Math.abs(selectedCandle.close - selectedCandle.open).toFixed(0)}K
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  
  // Enhanced Header Styles
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
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  healthStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subGreeting: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  healthStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.danger,
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 1,
  },
  upgradeBtn: {
    overflow: 'hidden',
    borderRadius: 12,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  upgradeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.purple,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  upgradeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  proActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 2,
    borderColor: COLORS.success + '30',
  },
  proActiveText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 0.5,
  },

  // PRO Banner Styles
  proBanner: {
    position: 'relative',
    backgroundColor: COLORS.purple,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  proBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
  },
  proBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 15,
  },
  proBannerIconWrapper: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.white,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  proBannerTextContainer: {
    flex: 1,
  },
  proBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  proBannerSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.95,
  },
  proBannerDecor1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  proBannerDecor2: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  
  // Chart Styles
  chartContainer: {
    backgroundColor: COLORS.dark,
    margin: 15,
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  chartLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  chartValue: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700'
  },
  chartControls: {
    flexDirection: 'row',
    gap: 8
  },
  chartBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#333'
  },
  chartBtnActive: {
    backgroundColor: COLORS.primary,
  },
  chartBtnText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  chartBtnTextActive: {
    color: COLORS.white,
  },
  chartScroll: {
    marginTop: 10
  },
  chartWrapper: {
    flexDirection: 'row',
    marginLeft: -20
  },
  yAxis: {
    width: 45,
    height: 180,
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginRight: 5,
  },
  yAxisLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'right',
  },
  gridContainer: {
    position: 'absolute',
    width: '100%',
    height: 180,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  gridLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  candleWrapper: {
    alignItems: 'center',
  },
  candlesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 180,
    paddingHorizontal: 5,
    gap: 12
  },
  candleContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 180,
  },
  wick: {
    width: 2,
  },
  candleBody: {
    width: 10,
    borderWidth: 1,
    minHeight: 3
  },
  timeLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },

  // Quick Menu Styles
  quickMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3
  },
  quickMenuItem: {
    alignItems: 'center',
    flex: 1
  },
  quickMenuIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: COLORS.primary + '15'
  },
  quickMenuLabel: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 14
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text
  },
  seeMoreBtn: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600'
  },

  // Health Card Styles
  healthCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  healthCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  healthIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthInfo: {
    marginLeft: 12,
    flex: 1
  },
  healthTitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4
  },
  healthAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2
  },
  healthPercentage: {
    fontSize: 12,
    fontWeight: '600'
  },
  healthCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  miniChart: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Order Table Styles
  orderTableContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  orderTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  orderHeaderLeft: {
    flex: 1
  },
  orderHeaderRight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  orderTableHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text
  },
  orderTableSubHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  orderTableSubHeaderText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  orderRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
    alignItems: 'center'
  },
  orderCell: {
    fontSize: 13,
    color: COLORS.text
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600'
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
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
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalBody: {
    padding: 20,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  modalInfo: {
    flex: 1,
  },
  modalLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 15,
  },
  priceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 15,
  },
  priceItem: {
    width: '47%',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalFooter: {
    marginTop: 10,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  trendText: {
    fontSize: 16,
    fontWeight: '700',
  },
});