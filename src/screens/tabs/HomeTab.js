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

// Simple Custom Candlestick Component
const Candle = ({ open, high, low, close, maxValue, time, onPress }) => {
  const isPositive = close >= open;
  const color = isPositive ? '#4CAF50' : '#F44336';
  
  const scale = 160; // Height scale - diperbesar dari 120 ke 160
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
        {/* Top Wick */}
        <View style={[styles.wick, { 
          height: Math.abs(wickTop - bodyTop),
          backgroundColor: color 
        }]} />
        
        {/* Body */}
        <View style={[styles.candleBody, { 
          height: bodyHeight,
          backgroundColor: color,
          borderColor: color,
          opacity: isPositive ? 1 : 0.7
        }]} />
        
        {/* Bottom Wick */}
        <View style={[styles.wick, { 
          height: Math.abs(bodyBottom - wickBottom),
          backgroundColor: color 
        }]} />
      </View>
      
      {/* Time Label */}
      <Text style={styles.timeLabel}>{time}</Text>
    </TouchableOpacity>
  );
};

export default function HomeTab({ navigation }) {
  const [selectedCandle, setSelectedCandle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Data dummy untuk candlestick dengan variasi tinggi yang lebih besar
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
    { id: 1, icon: 'receipt-outline', label: 'Pesanan', color: '#FFB800' },
    { id: 2, icon: 'document-text-outline', label: 'Laporan\nPenjualan', color: '#FFB800' },
    { id: 3, icon: 'trending-up-outline', label: 'Monitoring\nKlaim', color: '#FFB800' },
    { id: 4, icon: 'wallet-outline', label: 'Laporan\nKeuangan', color: '#FFB800' },
  ];

  const storeHealth = [
    {
      id: 1,
      icon: 'arrow-up-circle',
      iconColor: '#4CAF50',
      title: 'Uang Cair',
      amount: 'Rp10.000.234',
      percentage: '+45%',
      percentageColor: '#4CAF50',
      subtitle: 'dari bulan sebelumnya',
      trend: 'up',
      bgColor: '#E8F5E9'
    },
    {
      id: 2,
      icon: 'arrow-down-circle',
      iconColor: '#F44336',
      title: 'Selisih Ongkir',
      amount: 'Rp190.000',
      percentage: 'Selisih',
      percentageColor: '#F44336',
      subtitle: '',
      trend: 'down',
      bgColor: '#FFEBEE'
    },
    {
      id: 3,
      icon: 'alert-circle',
      iconColor: '#F44336',
      title: 'Retur Belum Sampai',
      amount: '10',
      percentage: 'Paket Bermasalah',
      percentageColor: '#F44336',
      subtitle: '',
      trend: 'down',
      bgColor: '#FFEBEE'
    }
  ];

  const recentOrders = [
    { id: 1, name: 'Mainan X', payment: 'Transfer BCA', status: 'Menunggu Cair', statusColor: '#00BCD4' },
    { id: 2, name: 'Mainan Z', payment: 'Paylater', status: 'Menunggu Cair', statusColor: '#00BCD4' },
    { id: 3, name: 'Toy Story Z', payment: 'Transfer BRI', status: 'Persiapan Dikirim', statusColor: '#FF9800' },
    { id: 4, name: 'Mainan B', payment: 'Paylater', status: 'Canceled', statusColor: '#F44336' },
    { id: 5, name: 'Mainan A', payment: 'Paylater', status: 'Persiapan Dikirim', statusColor: '#FF9800' },
  ];

  const renderTrendChart = (trend) => {
    if (trend === 'up') {
      return (
        <View style={styles.miniChart}>
          <Icon name="trending-up" size={40} color="#4CAF50" />
        </View>
      );
    } else {
      return (
        <View style={styles.miniChart}>
          <Icon name="trending-down" size={40} color="#F44336" />
        </View>
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, Yogi</Text>
          <Text style={styles.subGreeting}>Kesehatan Toko Anda:</Text>
          <Text style={styles.healthStatus}>Kurang Baik</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <View style={styles.notificationBadge} />
          <Icon name="notifications-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartLabel}>Omset</Text>
            <Text style={styles.chartValue}>Saat Ini: Rp 23.000.000</Text>
          </View>
          <View style={styles.chartControls}>
            <TouchableOpacity style={styles.chartBtn}>
              <Text style={styles.chartBtnText}>1D</Text>
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
          {/* Y-axis Labels (Nominal) */}
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>110K</Text>
            <Text style={styles.yAxisLabel}>90K</Text>
            <Text style={styles.yAxisLabel}>70K</Text>
            <Text style={styles.yAxisLabel}>50K</Text>
            <Text style={styles.yAxisLabel}>30K</Text>
          </View>

          {/* Chart Area */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.chartScroll}
          >
            <View>
              {/* Horizontal Grid Lines */}
              <View style={styles.gridContainer}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.gridLine} />
                ))}
              </View>

              {/* Candles */}
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
          <TouchableOpacity key={menu.id} style={styles.quickMenuItem}>
            <View style={[styles.quickMenuIcon, { backgroundColor: menu.color + '20' }]}>
              <Icon name={menu.icon} size={24} color={menu.color} />
            </View>
            <Text style={styles.quickMenuLabel}>{menu.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Kesehatan Toko Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Kesehatan Toko</Text>
        <TouchableOpacity onPress={() => navigation.navigate('KesehatanTokoScreen')}>
          <Text style={styles.seeMoreBtn}>Lebih Lengkap</Text>
        </TouchableOpacity>
      </View>

      {storeHealth.map((item) => (
        <View key={item.id} style={[styles.healthCard, { backgroundColor: item.bgColor }]}>
          <View style={styles.healthCardLeft}>
            <Icon name={item.icon} size={28} color={item.iconColor} />
            <View style={styles.healthInfo}>
              <Text style={styles.healthTitle}>{item.title}</Text>
              <Text style={styles.healthAmount}>{item.amount}</Text>
              <Text style={[styles.healthPercentage, { color: item.percentageColor }]}>
                {item.percentage} {item.subtitle}
              </Text>
            </View>
          </View>
          <View style={styles.healthCardRight}>
            {renderTrendChart(item.trend)}
            <Icon name="chevron-forward" size={20} color="#999" />
          </View>
        </View>
      ))}

      {/* Pesanan Terbaru Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pesanan Terbaru</Text>
        <TouchableOpacity>
          <Text style={styles.seeMoreBtn}>Lebih Lengkap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.orderTableContainer}>
        {/* Table Header */}
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

        {/* Table Rows */}
        {recentOrders.map((order) => (
          <View key={order.id} style={styles.orderRow}>
            <Text style={[styles.orderCell, { flex: 1.2 }]}>{order.name}</Text>
            <Text style={[styles.orderCell, { flex: 1 }]}>{order.payment}</Text>
            <View style={{ flex: 1 }}>
              <View style={[styles.statusBadge, { backgroundColor: order.statusColor + '20' }]}>
                <Text style={[styles.statusText, { color: order.statusColor }]}>
                  {order.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Spacing */}
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
                <Icon name="close-circle" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedCandle && (
              <View style={styles.modalBody}>
                <View style={styles.modalRow}>
                  <Icon name="time-outline" size={24} color="#4CAF50" />
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalLabel}>Waktu</Text>
                    <Text style={styles.modalValue}>{selectedCandle.time}</Text>
                  </View>
                </View>

                {/* <View style={styles.modalRow}>
                  <Icon name="cash-outline" size={24} color="#FFB800" />
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalLabel}>Omset</Text>
                    <Text style={styles.modalValueLarge}>{selectedCandle.omset}</Text>
                  </View>
                </View> */}

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
                    { backgroundColor: selectedCandle.close >= selectedCandle.open ? '#E8F5E9' : '#FFEBEE' }
                  ]}>
                    <Icon 
                      name={selectedCandle.close >= selectedCandle.open ? "trending-up" : "trending-down"} 
                      size={20} 
                      color={selectedCandle.close >= selectedCandle.open ? '#4CAF50' : '#F44336'} 
                    />
                    <Text style={[
                      styles.trendText,
                      { color: selectedCandle.close >= selectedCandle.open ? '#4CAF50' : '#F44336' }
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
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff'
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  healthStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F44336'
  },
  notificationBtn: {
    position: 'relative',
    padding: 8
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
    zIndex: 1
  },
  
  // Chart Styles
  chartContainer: {
    backgroundColor: '#1A1A1A',
    margin: 15,
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  chartLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4
  },
  chartValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  chartControls: {
    flexDirection: 'row',
    gap: 8
  },
  chartBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#333'
  },
  chartBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
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
    color: '#888',
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
    backgroundColor: '#4CAF50'
  },
  candleBody: {
    width: 10,
    borderWidth: 1,
    minHeight: 3
  },
  timeLabel: {
    fontSize: 9,
    color: '#888',
    marginTop: 6,
    fontWeight: '600',
  },

  // Quick Menu Styles
  quickMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  quickMenuItem: {
    alignItems: 'center',
    flex: 1
  },
  quickMenuIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  quickMenuLabel: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
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
    color: '#000'
  },
  seeMoreBtn: {
    fontSize: 14,
    color: '#00BCD4',
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
  healthInfo: {
    marginLeft: 12,
    flex: 1
  },
  healthTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4
  },
  healthAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
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
    backgroundColor: '#fff',
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
    borderBottomColor: '#f0f0f0'
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
    color: '#000'
  },
  orderTableSubHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  orderTableSubHeaderText: {
    fontSize: 12,
    color: '#999',
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
    color: '#333'
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
    backgroundColor: '#fff',
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
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
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
    color: '#666',
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  modalValueLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
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