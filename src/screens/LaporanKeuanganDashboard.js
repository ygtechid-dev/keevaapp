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
  Alert,
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

export default function LaporanKeuanganDashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Data states
  const [orders, setOrders] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [payoutData, setPayoutData] = useState(null);
  const [returnsData, setReturnsData] = useState([]);
  
  // Calculated stats
  const [quickStats, setQuickStats] = useState({
    barangBelumSampai: 0,
    barangSudahCair: 0,
    barangHilang: 0,
    selisihOngkir: 0,
  });

  const [financialSummary, setFinancialSummary] = useState({
    totalOmzet: 0,
    totalOrder: 0,
    totalSelesai: 0,
    totalCair: 0,
    dalamPerjalanan: 0,
  });

  useEffect(() => {
    loadAllData();
  }, []);


  useEffect(() => {
  if (orders.length > 0) {
    processOrderStats(orders);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [orders, payoutData]);


const loadAllData = async () => {
  console.log("🚀 loadAllData() STARTED");
  const startTime = Date.now();

  try {
    setLoading(true);
    setError(null);

    console.log("🔍 Checking Lazada token...");

    const lazadaTokenData = await AsyncStorage.getItem('lazada_token');

    if (!lazadaTokenData) {
      console.log("❌ Token Lazada TIDAK ditemukan di AsyncStorage");
      setError('Token Lazada tidak ditemukan');
      setLoading(false);
      return;
    }

    const tokenData = JSON.parse(lazadaTokenData);
    const accessToken = tokenData.access_token;

    console.log("🔐 Access Token:", accessToken ? "FOUND" : "NULL");

    console.log("📡 Fetching all Lazada data in parallel...");

    const [ordersRes, payoutsRes, returnsRes, financeRes] = await Promise.allSettled([
      fetchOrders(accessToken),
      fetchPayouts(accessToken),
      fetchReturns(accessToken),
      fetchFinanceTransactions(accessToken),
    ]);

    console.log("📦 API RESULTS:");
    console.log("➡️ Orders:", ordersRes.status);
    console.log("➡️ Payouts:", payoutsRes.status);
    console.log("➡️ Returns:", returnsRes.status);
    console.log("➡️ Finance:", financeRes.status);

    // ============================
    // Process Orders
    // ============================
    if (ordersRes.status === 'fulfilled') {
      console.log("🟢 Orders response:", ordersRes.value);
      const ordersData = ordersRes.value;
      setOrders(ordersData);
      processOrderStats(ordersData);
    } else {
      console.log("🔴 Orders error:", ordersRes.reason);
    }

    // ============================
    // Process Payouts
    // ============================
    if (payoutsRes.status === 'fulfilled') {
      console.log("🟢 Payouts responses:", payoutsRes.value);
      setPayoutData(payoutsRes.value);
    } else {
      console.log("🔴 Payouts error:", payoutsRes.reason);
    }

    // ============================
    // Process Returns
    // ============================
    if (returnsRes.status === 'fulfilled') {
      console.log("🟢 Returns response:", returnsRes.value);
      setReturnsData(returnsRes.value);
    } else {
      console.log("🔴 Returns error:", returnsRes.reason);
    }

    // ============================
    // Process Finance
    // ============================
    if (financeRes.status === 'fulfilled') {
      console.log("🟢 Finance response:", financeRes.value);
      setFinancialData(financeRes.value);
    } else {
      console.log("🔴 Finance error:", financeRes.reason);
    }

  } catch (err) {
    console.log("🔥 FATAL ERROR in loadAllData():", err);
    setError('Gagal memuat data');
  } finally {
    setLoading(false);
    setRefreshing(false);

    console.log(`🏁 loadAllData() FINISHED in ${Date.now() - startTime} ms`);
  }
};


  const fetchOrders = async (accessToken) => {
    try {
      // Get orders from last 30 days
   const endDate = new Date();
const startDate = new Date(endDate.getFullYear(), 0, 1);

      const response = await axios.post(
        `${API_URL}/api/lazada/orders`,
        {
          access_token: accessToken,
          created_after: formatDateForAPI(startDate),
          created_before: formatDateForAPI(endDate),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
console.log('====================================');
console.log('orfet', response.data.data);
console.log('====================================');
      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching orders:', err);
      return [];
    }
  };

const fetchPayouts = async (accessToken) => {
  try {
       const endDate = new Date();
const startDate = new Date(endDate.getFullYear(), 0, 1);
    const response = await axios.post(
      `${API_URL}/api/lazada/payouts`,
      { 
        access_token: accessToken,
        created_after: startDate
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    
    console.log('====================================');
    console.log('PAYOUTS RESPONSE:', response.data);
    console.log('====================================');
    
    return response.data.data || [];
  } catch (err) {
    console.error('Error fetching payouts:', err);
    return [];
  }
};

  const fetchReturns = async (accessToken) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/lazada/returns`,
        { access_token: accessToken },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching returns:', err);
      return [];
    }
  };

  const fetchFinanceTransactions = async (accessToken) => {
    try {
        const endDate = new Date();

// Tentukan awal tahun
const startOfYear = new Date(endDate.getFullYear(), 0, 1);

// Hitung batas maksimum 180 hari
const maxDays = 180;
const maxRangeStart = new Date(endDate);
maxRangeStart.setDate(endDate.getDate() - maxDays);

// Jika awal tahun lebih tua dari 180 hari → pakai batas 180 hari
const startDate = startOfYear < maxRangeStart ? maxRangeStart : startOfYear;

      const response = await axios.post(
        `${API_URL}/api/lazada/finance-transactions`,
        {
          access_token: accessToken,
          start_time: formatDateForAPI(startDate),
          end_time: formatDateForAPI(endDate),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('====================================');
      console.log('resifin', response.data);
      console.log('====================================');
      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching finance:', err);
      return [];
    }
  };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00+07:00`;
  };

const processOrderStats = (ordersData) => {
  console.log("📊 Processing order stats...");
  console.log("📦 Total orders:", ordersData.length);

  let totalOmzet = 0;
  let totalOrder = 0;
  let totalSelesai = 0;
  let dalamPerjalanan = 0;
  let barangBelumSampai = 0;
  let barangHilang = 0;
  let selisihOngkir = 0;

  ordersData.forEach(order => {
    const price = parseFloat(order.price || 0);
    const status = order.statuses && order.statuses[0] ? order.statuses[0].toLowerCase() : '';

    totalOmzet += price;
    totalOrder++;

    // Count by status (backup calculation dari orders)
    if (status === 'completed') {
      totalSelesai++;
    } else if (status === 'shipped' || status === 'delivered') {
      dalamPerjalanan++;
      barangBelumSampai++;
    } else if (status === 'canceled' || status === 'cancelled') {
      barangHilang++;
    }

    // Calculate shipping difference
    const shippingFeeOriginal = parseFloat(order.shipping_fee_original || 0);
    const shippingFee = parseFloat(order.shipping_fee || 0);
    const shippingDiff = shippingFeeOriginal - shippingFee;
    if (shippingDiff > 0) {
      selisihOngkir += shippingDiff;
    }
  });

  // ====================================
  // 💰 Calculate TOTAL CAIR from Payouts
  // ====================================
  let barangSudahCair = 0;
  
  console.log("💰 Processing payouts...");
  console.log("Payout data:", payoutData);
  
  if (payoutData && Array.isArray(payoutData) && payoutData.length > 0) {
    barangSudahCair = payoutData.reduce((sum, payout) => {
      let payoutAmount = 0;
      
      if (payout.payout) {
        const payoutStr = payout.payout.toString().replace(/IDR/gi, '').trim();
        payoutAmount = parseFloat(payoutStr) || 0;
      } else if (payout.closing_balance) {
        payoutAmount = parseFloat(payout.closing_balance) || 0;
      }
      
      console.log(`  - Payout: ${payout.payout || payout.closing_balance} → ${payoutAmount}`);
      
      return sum + payoutAmount;
    }, 0);
  }

  console.log("💵 Total Sudah Cair:", barangSudahCair);

  // ====================================
  // 📊 Calculate REAL VALUES from Financial Transactions
  // ====================================
  let totalPenjualanBersih = 0;
  let totalBiayaLazada = 0;
  let estimasiDalamPerjalanan = 0;
  let totalSelesaiFromFinance = 0; // ← BARU: hitung dari finance
  let totalShippedFromFinance = 0; // ← BARU: hitung shipped dari finance

  console.log("📊 Processing financial transactions...");
  console.log("Finance data:", financialData);

  if (financialData && Array.isArray(financialData) && financialData.length > 0) {
    // Gunakan Set untuk unique order items
    const deliveredOrders = new Set();
    const shippedOrders = new Set();

    financialData.forEach(transaction => {
      const amount = parseFloat(transaction.amount || 0);
      const orderItemStatus = transaction.orderItem_status || '';
      const orderItemNo = transaction.orderItem_no || '';

      // Hitung total penjualan bersih
      if (amount > 0) {
        totalPenjualanBersih += amount;
      } else {
        totalBiayaLazada += Math.abs(amount);
      }

      // ========================================
      // COUNT DELIVERED ORDERS (Total Selesai)
      // ========================================
      if (orderItemStatus === 'Delivered' && orderItemNo) {
        deliveredOrders.add(orderItemNo);
      }

      // ========================================
      // COUNT SHIPPED ORDERS (Dalam Perjalanan)
      // ========================================
      if ((orderItemStatus === 'Shipped' || orderItemStatus === 'Ready to Ship') && orderItemNo) {
        shippedOrders.add(orderItemNo);
        estimasiDalamPerjalanan += Math.abs(amount);
      }
    });

    totalSelesaiFromFinance = deliveredOrders.size;
    totalShippedFromFinance = shippedOrders.size;

    console.log("📦 Delivered orders from finance:", totalSelesaiFromFinance);
    console.log("🚚 Shipped orders from finance:", totalShippedFromFinance);
  }

  console.log("💸 Total Penjualan Bersih:", totalPenjualanBersih);
  console.log("💸 Total Biaya Lazada:", totalBiayaLazada);

  // ====================================
  // Calculate Final Values
  // ====================================
  const finalTotalOmzet = financialData && financialData.length > 0 
    ? totalPenjualanBersih + totalBiayaLazada
    : totalOmzet;

  const finalTotalSelesai = financialData && financialData.length > 0
    ? totalSelesaiFromFinance  // ← GUNAKAN DATA DARI FINANCE
    : totalSelesai;            // ← FALLBACK KE DATA ORDERS

  const finalDalamPerjalanan = financialData && financialData.length > 0
    ? totalShippedFromFinance  // ← GUNAKAN COUNT DARI FINANCE
    : dalamPerjalanan;

  // ====================================
  // Update States
  // ====================================
  setQuickStats({
    barangBelumSampai: finalDalamPerjalanan, // Update juga ini dari finance
    barangSudahCair,
    barangHilang: barangHilang > 0 ? barangHilang : 0,
    selisihOngkir,
  });

  setFinancialSummary({
    totalOmzet: finalTotalOmzet,
    totalOrder,
    totalSelesai: finalTotalSelesai, // ← INI SEKARANG DARI FINANCE
    totalCair: barangSudahCair,
    dalamPerjalanan: finalDalamPerjalanan,
  });

  console.log("✅ Stats processed successfully");
  console.log("📊 Final Summary:", {
    totalOmzet: finalTotalOmzet,
    totalOrder,
    totalSelesai: finalTotalSelesai,
    totalCair: barangSudahCair,
    dalamPerjalanan: finalDalamPerjalanan,
  });
};

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const formatRupiah = (value) => {
    if (value >= 1000000) {
      return `Rp${(value / 1000000).toFixed(1)} jt`;
    } else if (value >= 1000) {
      return `Rp${(value / 1000).toFixed(0)}k`;
    }
    return `Rp${value.toLocaleString('id-ID')}`;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Laporan Keuangan</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat data keuangan...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Laporan Keuangan</Text>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAllData}>
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
        <Text style={styles.headerTitle}>Laporan Keuangan</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={onRefresh}>
            <Icon name="refresh" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="notifications-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats Grid - 2x2 */}
        <View style={styles.quickStatsGrid}>
          <TouchableOpacity
            style={styles.quickStatCard}
            onPress={() => navigation.navigate('LaporanPesananScreen')}
            activeOpacity={0.7}
          >
            <View style={styles.quickStatHeader}>
              <Text style={styles.quickStatTitle}>Barang Belum Sampai</Text>
              <TouchableOpacity>
                <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.quickStatSubtitle}>Order</Text>
            <Text style={styles.quickStatCount}>{quickStats.barangBelumSampai}</Text>
            <View style={styles.quickStatActions}>
              <TouchableOpacity 
                style={styles.quickStatActionBtn}
                onPress={() => navigation.navigate('LaporanPesananScreen')}
              >
                <Text style={styles.quickStatActionText}>Detail</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickStatCard}
            activeOpacity={0.7}
          >
            <View style={styles.quickStatHeader}>
              <Text style={styles.quickStatTitle}>Barang Sudah Cair</Text>
              <TouchableOpacity>
                <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.quickStatSubtitle}>Total</Text>
            <Text style={styles.quickStatCount}>{formatRupiah(quickStats.barangSudahCair)}</Text>
            <View style={styles.quickStatActions}>
              <TouchableOpacity style={styles.quickStatActionBtn}>
                <Text style={styles.quickStatActionText}>Detail</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickStatCard}
            activeOpacity={0.7}
          >
            <View style={styles.quickStatHeader}>
              <Text style={styles.quickStatTitle}>Barang Hilang</Text>
              <TouchableOpacity>
                <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.quickStatSubtitle}>Potensi Kerugian</Text>
            <Text style={styles.quickStatCount}>{formatRupiah(quickStats.barangHilang)}</Text>
            <View style={styles.quickStatActions}>
              <TouchableOpacity 
                style={styles.quickStatActionBtn}
                onPress={() => navigation.navigate('FormKlaimScreen', { claimType: 'Barang Hilang' })}
              >
                <Text style={styles.quickStatActionText}>Ajukan Klaim</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickStatCard}
            activeOpacity={0.7}
          >
            <View style={styles.quickStatHeader}>
              <Text style={styles.quickStatTitle}>Selisih Ongkir</Text>
              <TouchableOpacity>
                <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.quickStatSubtitle}>Total</Text>
            <Text style={styles.quickStatCount}>{formatRupiah(quickStats.selisihOngkir)}</Text>
            <View style={styles.quickStatActions}>
              <TouchableOpacity 
                style={styles.quickStatActionBtn}
                onPress={() => navigation.navigate('FormKlaimScreen', { claimType: 'Selisih Ongkir' })}
              >
                <Text style={styles.quickStatActionText}>Ajukan Klaim</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Omzet Harian Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Omzet Harian</Text>
              <View style={styles.omzetRow}>
                <Text style={styles.omzetAmount}>
                  {formatRupiah(financialSummary.totalOmzet)}
                </Text>
                <TouchableOpacity>
                  <Icon name="chevron-forward" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity>
              <Icon name="filter-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Selisih Ongkir Card */}
          {quickStats.selisihOngkir > 0 && (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderLabel}>Total Selisih Ongkir</Text>
                  <Text style={styles.orderValue}>
                    {formatRupiah(quickStats.selisihOngkir)}
                  </Text>
                </View>
                <Text style={styles.orderId}>30 hari terakhir</Text>
              </View>
              <TouchableOpacity 
                style={styles.orderActionBtn}
                onPress={() => navigation.navigate('FormKlaimScreen', { claimType: 'Selisih Ongkir' })}
              >
                <Text style={styles.orderActionText}>Ajukan Klaim</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Laporan Keuangan Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Laporan Keuangan</Text>
            <TouchableOpacity>
              <Icon name="information-circle-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Order</Text>
              <Text style={styles.summaryValue}>{financialSummary.totalOrder}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Selesai</Text>
              <Text style={styles.summaryValue}>{financialSummary.totalSelesai}</Text>
            </View>
          </View>

          {/* Chart Placeholder */}
          <View style={styles.chartContainer}>
            <View style={styles.chartLine} />
            <Icon name="trending-up" size={80} color={COLORS.primary + '30'} style={styles.chartIcon} />
          </View>

          {/* Bottom Summary */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Cair</Text>
              <Text style={styles.summaryValue}>
                {formatRupiah(financialSummary.totalCair)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Dalam Perjalanan</Text>
              <Text style={styles.summaryValue}>
                {formatRupiah(financialSummary.dalamPerjalanan)}
              </Text>
            </View>
          </View>

          {/* Platform Stats */}
          <View style={styles.platformRow}>
            <Text style={styles.platformName}>Lazada</Text>
            <Text style={styles.platformValue}>
              {formatRupiah(financialSummary.totalOmzet)}
            </Text>
          </View>
        </View>

        {/* Returns Section */}
        {returnsData.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pengembalian</Text>
              <Text style={styles.sectionSubtitle}>{returnsData.length} item</Text>
            </View>
            
            {returnsData.slice(0, 3).map((returnItem, index) => (
              <View key={index} style={styles.returnCard}>
                <Icon name="return-down-back" size={20} color={COLORS.warning} />
                <View style={styles.returnInfo}>
                  <Text style={styles.returnText}>Return #{returnItem.return_id || index + 1}</Text>
                  <Text style={styles.returnStatus}>{returnItem.status || 'Processing'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
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
    paddingTop: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  iconBtn: {
    padding: 4,
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

  // Quick Stats Grid
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  quickStatCard: {
    width: (width - 30) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  quickStatTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    lineHeight: 18,
  },
  quickStatSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  quickStatCount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  quickStatActions: {
    gap: 6,
  },
  quickStatActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  quickStatActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  // Summary Cards
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Chart
  chartContainer: {
    height: 120,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chartLine: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    height: 60,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.primary + '30',
    borderBottomLeftRadius: 8,
  },
  chartIcon: {
    opacity: 0.3,
  },

  // Platform Row
  platformRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  platformName: {
    fontSize: 13,
    color: COLORS.text,
  },
  platformValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Omzet Section
  omzetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 5,
  },
  omzetAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Order Cards
  orderCard: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  orderValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.danger,
  },
  orderId: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  orderActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  orderActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Return Cards
  returnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    gap: 12,
  },
  returnInfo: {
    flex: 1,
  },
  returnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  returnStatus: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});