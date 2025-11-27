import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../context/APIUrl';

const { width } = Dimensions.get('window');

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
  info: '#17a2b8',
};

export default function LaporanPenjualanScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [lazadaOrders, setLazadaOrders] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalPenjualan: 0,
    totalTransaksi: 0,
    rataRataTransaksi: 0,
    produkTerjual: 0,
  });
  const [salesByStatus, setSalesByStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Period options
  const periods = [
    { id: 'today', label: 'Hari Ini', days: 0 },
    { id: 'week', label: 'Minggu Ini', days: 7 },
    { id: 'month', label: 'Bulan Ini', days: 30 },
    { id: 'all', label: 'Semua', days: 365 },
  ];

  useEffect(() => {
    fetchLazadaOrders();
  }, [selectedPeriod]);

  const fetchLazadaOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const lazadaTokenData = await AsyncStorage.getItem('lazada_token');
      if (!lazadaTokenData) {
        setError('Token Lazada tidak ditemukan');
        setLoading(false);
        return;
      }

      const tokenData = JSON.parse(lazadaTokenData);
      const accessToken = tokenData.access_token;

      // Calculate date range based on selected period
      const endDate = new Date();
      const startDate = new Date();
      const selectedPeriodData = periods.find(p => p.id === selectedPeriod);
      
      if (selectedPeriod === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate.setDate(startDate.getDate() - selectedPeriodData.days);
      }

      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      const response = await axios.post(
        `${API_URL}/api/lazada/orders`,
        {
          access_token: accessToken,
          created_after: formattedStartDate,
          created_before: formattedEndDate,
          limit: '100',
          offset: '0',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const orders = response.data.data || [];
      setLazadaOrders(orders);
      
      // Process data
      processOrderData(orders);
      
    } catch (err) {
      console.error('Error fetching Lazada orders:', err);
      setError(err.response?.data?.message || 'Gagal memuat data penjualan');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00+07:00`;
  };

  const processOrderData = (orders) => {
    // Calculate summary statistics
    const totalPenjualan = orders.reduce((sum, order) => sum + parseFloat(order.price || 0), 0);
    const totalTransaksi = orders.length;
    const rataRataTransaksi = totalTransaksi > 0 ? totalPenjualan / totalTransaksi : 0;
    const produkTerjual = orders.reduce((sum, order) => sum + (order.items_count || 0), 0);

    setSummaryStats({
      totalPenjualan,
      totalTransaksi,
      rataRataTransaksi,
      produkTerjual,
    });

    // Group by status
    const statusGroups = {};
    orders.forEach(order => {
      const status = order.statuses && order.statuses[0] ? order.statuses[0] : 'unknown';
      if (!statusGroups[status]) {
        statusGroups[status] = {
          status: status,
          count: 0,
          amount: 0,
        };
      }
      statusGroups[status].count++;
      statusGroups[status].amount += parseFloat(order.price || 0);
    });

    const statusArray = Object.values(statusGroups).map((group, index) => ({
      ...group,
      percentage: totalPenjualan > 0 ? (group.amount / totalPenjualan * 100).toFixed(1) : 0,
      color: getStatusColor(group.status),
    }));

    setSalesByStatus(statusArray);

    // Group products
    const productGroups = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const productId = item.product_id || item.sku;
          if (!productGroups[productId]) {
            productGroups[productId] = {
              id: productId,
              name: item.name || 'Produk',
              sold: 0,
              revenue: 0,
              image: item.product_main_image || null,
            };
          }
          productGroups[productId].sold += 1;
          productGroups[productId].revenue += parseFloat(item.paid_price || 0);
        });
      }
    });

    const productsArray = Object.values(productGroups)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setTopProducts(productsArray);

    // Group by date (last 7 days)
    const dailyGroups = {};
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push(dateStr);
      dailyGroups[dateStr] = {
        day: getDayName(date),
        amount: 0,
        orders: 0,
      };
    }

    orders.forEach(order => {
      const orderDate = order.created_at.split(' ')[0];
      if (dailyGroups[orderDate]) {
        dailyGroups[orderDate].amount += parseFloat(order.price || 0);
        dailyGroups[orderDate].orders++;
      }
    });

    const dailyArray = last7Days.map(date => dailyGroups[date]);
    setDailySales(dailyArray);

    // Group by payment method
    const paymentGroups = {};
    orders.forEach(order => {
      const method = order.payment_method || 'Unknown';
      if (!paymentGroups[method]) {
        paymentGroups[method] = {
          method: method,
          count: 0,
          amount: 0,
        };
      }
      paymentGroups[method].count++;
      paymentGroups[method].amount += parseFloat(order.price || 0);
    });

    const paymentArray = Object.values(paymentGroups).map((group, index) => ({
      ...group,
      percentage: totalPenjualan > 0 ? (group.amount / totalPenjualan * 100).toFixed(1) : 0,
      color: getPaymentColor(index),
    }));

    setPaymentMethods(paymentArray);
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
      case 'unpaid':
        return COLORS.warning;
      case 'ready_to_ship':
        return COLORS.info;
      case 'shipped':
      case 'delivered':
        return COLORS.primary;
      case 'completed':
        return COLORS.success;
      case 'canceled':
      case 'cancelled':
        return COLORS.danger;
      default:
        return COLORS.textMuted;
    }
  };

  const getPaymentColor = (index) => {
    const colors = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.purple, COLORS.info];
    return colors[index % colors.length];
  };

  const getDayName = (date) => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[date.getDay()];
  };

  const getStatusLabel = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'Pending';
      case 'unpaid': return 'Belum Bayar';
      case 'ready_to_ship': return 'Siap Kirim';
      case 'shipped': return 'Dikirim';
      case 'delivered': return 'Terkirim';
      case 'completed': return 'Selesai';
      case 'canceled':
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLazadaOrders();
  };

  const maxDailySales = Math.max(...dailySales.map(d => d.amount), 1);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Laporan Penjualan Lazada</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat data penjualan...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Laporan Penjualan</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchLazadaOrders}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan Penjualan Lazada</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="download-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="share-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodScroll}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodBtn,
                selectedPeriod === period.id && styles.periodBtnActive
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[
                styles.periodBtnText,
                selectedPeriod === period.id && styles.periodBtnTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryMain}>
            <Text style={styles.summaryLabel}>Total Penjualan</Text>
            <Text style={styles.summaryValue}>
              Rp{summaryStats.totalPenjualan.toLocaleString('id-ID')}
            </Text>
            <View style={styles.summaryBadge}>
              {/* <Icon name="logo-lazada" size={16} color={COLORS.white} /> */}
              <Text style={styles.summaryBadgeText}>Lazada</Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryGridItem}>
              <Icon name="receipt-outline" size={20} color={COLORS.primary} />
              <Text style={styles.summaryGridValue}>{summaryStats.totalTransaksi}</Text>
              <Text style={styles.summaryGridLabel}>Transaksi</Text>
            </View>
            <View style={styles.summaryGridItem}>
              <Icon name="cash-outline" size={20} color={COLORS.success} />
              <Text style={styles.summaryGridValue}>
                Rp{Math.round(summaryStats.rataRataTransaksi / 1000)}k
              </Text>
              <Text style={styles.summaryGridLabel}>Rata-rata</Text>
            </View>
            <View style={styles.summaryGridItem}>
              <Icon name="cube-outline" size={20} color={COLORS.warning} />
              <Text style={styles.summaryGridValue}>{summaryStats.produkTerjual}</Text>
              <Text style={styles.summaryGridLabel}>Produk Terjual</Text>
            </View>
          </View>
        </View>

        {/* Daily Sales Chart */}
        {dailySales.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tren Penjualan (7 Hari)</Text>
              <TouchableOpacity>
                <Icon name="ellipsis-horizontal" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
              {dailySales.map((item, index) => {
                const barHeight = item.amount > 0 ? (item.amount / maxDailySales) * 120 : 20;
                return (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.chartBarValue}>
                      <Text style={styles.chartBarAmount}>
                        {item.amount > 0 ? Math.round(item.amount / 1000) + 'k' : '0'}
                      </Text>
                    </View>
                    <View style={[styles.chartBarFill, { height: barHeight }]} />
                    <Text style={styles.chartBarLabel}>{item.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Sales by Status */}
        {salesByStatus.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Penjualan per Status</Text>
            </View>

            {salesByStatus.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{getStatusLabel(item.status)}</Text>
                    <Text style={styles.categoryAmount}>
                      {item.count} pesanan • Rp{item.amount.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
                </View>
              </View>
            ))}

            {/* Status Chart */}
            <View style={styles.categoryChart}>
              {salesByStatus.map((item, index) => (
                <View 
                  key={index}
                  style={[
                    styles.categoryChartBar,
                    { 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }
                  ]} 
                />
              ))}
            </View>
          </View>
        )}

        {/* Top Products */}
        {topProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Produk Terlaris</Text>
            </View>

            {topProducts.map((product, index) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productRank}>
                  <Text style={styles.productRankText}>{index + 1}</Text>
                </View>
                <View style={styles.productImage}>
                  <Icon name="image-outline" size={24} color={COLORS.textMuted} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productSold}>{product.sold} terjual</Text>
                </View>
                <View style={styles.productRevenue}>
                  <Text style={styles.productRevenueValue}>
                    Rp{(product.revenue / 1000).toFixed(0)}k
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Payment Methods */}
        {paymentMethods.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
            </View>

            {paymentMethods.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{item.method}</Text>
                    <Text style={styles.categoryAmount}>
                      {item.count} transaksi • Rp{item.amount.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {lazadaOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="bar-chart-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyStateText}>Tidak ada data penjualan</Text>
            <Text style={styles.emptyStateSubtext}>
              Data penjualan akan muncul di sini
            </Text>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginLeft: 15,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },

  // Loading & Error
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: COLORS.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    marginTop: 15,
    fontSize: 14,
    color: COLORS.danger,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Period Selector
  periodContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  periodScroll: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 8,
  },
  periodBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 8,
  },
  periodBtnActive: {
    backgroundColor: COLORS.primary,
  },
  periodBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  periodBtnTextActive: {
    color: COLORS.white,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryMain: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0F156D',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryGridItem: {
    alignItems: 'center',
    gap: 6,
  },
  summaryGridValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryGridLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Chart
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBarValue: {
    marginBottom: 4,
  },
  chartBarAmount: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  chartBarFill: {
    width: '70%',
    backgroundColor: COLORS.primary + '30',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 20,
  },
  chartBarLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },

  // Category
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  categoryAmount: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  categoryRight: {},
  categoryPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  categoryChart: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 15,
  },
  categoryChartBar: {
    height: '100%',
  },

  // Product Card
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: 12,
  },
  productRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productRankText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productSold: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  productRevenue: {
    alignItems: 'flex-end',
  },
  productRevenueValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 5,
  },
});