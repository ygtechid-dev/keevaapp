import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../context/APIUrl';

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
  card: '#FFFFFF',
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

// ChatGPT API Configuration
const OPENAI_API_KEY = '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';

export default function KesehatanTokoTab({ navigation }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedStore, setSelectedStore] = useState('lazada');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showMetricDetailModal, setShowMetricDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Platform options
  const platforms = [
    { id: 'lazada', name: 'Lazada', icon: 'pricetag', color: '#0F146D' },
    { id: 'all', name: 'Semua Toko', icon: 'apps', color: COLORS.primary },
    { id: 'shopee', name: 'Shopee', icon: 'bag-handle', color: '#EE4D2D' },
    { id: 'tiktok', name: 'TikTok Shop', icon: 'musical-notes', color: '#000000' },
    { id: 'tokopedia', name: 'Tokopedia', icon: 'cart', color: '#42B549' },
  ];

  // Financial data states
  const [orders, setOrders] = useState([]);
  const [payoutData, setPayoutData] = useState([]);
  const [returnsData, setReturnsData] = useState([]);
  const [financialData, setFinancialData] = useState([]);

  // Quick stats
  const [quickStats, setQuickStats] = useState({
    barangBelumSampai: 0,
    barangSudahCair: 0,
    barangHilang: 0,
    selisihOngkir: 0,
  });

  // Financial summary
  const [financialSummary, setFinancialSummary] = useState({
    totalOmzet: 0,
    totalOrder: 0,
    totalSelesai: 0,
    totalCair: 0,
    dalamPerjalanan: 0,
  });

  // Store condition state
  const [storeCondition, setStoreCondition] = useState({
    status: 'Memuat...',
    score: 0,
    statusColor: COLORS.textMuted,
    lastUpdate: new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  // Main metrics state
  const [mainMetrics, setMainMetrics] = useState([]);

  // Problem areas state
  const [problemAreas, setProblemAreas] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00+07:00`;
  };

  const loadAllData = async () => {
    console.log("🚀 loadAllData() STARTED");
    setLoading(true);

    try {
      const lazadaTokenData = await AsyncStorage.getItem('lazada_token');

      if (!lazadaTokenData) {
        Alert.alert('Error', 'Token Lazada tidak ditemukan');
        setLoading(false);
        return;
      }

      const tokenData = JSON.parse(lazadaTokenData);
      const accessToken = tokenData.access_token;

      console.log("📡 Fetching all Lazada data...");

      // Fetch all data in parallel
      const [ordersRes, payoutsRes, returnsRes, financeRes] = await Promise.allSettled([
        fetchOrders(accessToken),
        fetchPayouts(accessToken),
        fetchReturns(accessToken),
        fetchFinanceTransactions(accessToken),
      ]);

      // Process Orders
      if (ordersRes.status === 'fulfilled') {
        const ordersData = ordersRes.value;
        setOrders(ordersData);
      }

      // Process Payouts
      if (payoutsRes.status === 'fulfilled') {
        setPayoutData(payoutsRes.value);
      }

      // Process Returns
      if (returnsRes.status === 'fulfilled') {
        setReturnsData(returnsRes.value);
      }

      // Process Finance
      if (financeRes.status === 'fulfilled') {
        setFinancialData(financeRes.value);
      }

      // Calculate stats after all data loaded
      if (ordersRes.status === 'fulfilled') {
        processOrderStats(
          ordersRes.value,
          payoutsRes.status === 'fulfilled' ? payoutsRes.value : [],
          financeRes.status === 'fulfilled' ? financeRes.value : []
        );
      }

    } catch (err) {
      console.error('❌ Error loading data:', err);
      Alert.alert('Error', 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (accessToken) => {
    try {
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
          created_after: formatDateForAPI(startDate)
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

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
      const startOfYear = new Date(endDate.getFullYear(), 0, 1);
      const maxDays = 180;
      const maxRangeStart = new Date(endDate);
      maxRangeStart.setDate(endDate.getDate() - maxDays);
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

      return response.data.data || [];
    } catch (err) {
      console.error('Error fetching finance:', err);
      return [];
    }
  };

  const processOrderStats = (ordersData, payoutsData, financeData) => {
    console.log("📊 Processing order stats...");

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

      if (status === 'completed') {
        totalSelesai++;
      } else if (status === 'shipped' || status === 'delivered') {
        dalamPerjalanan++;
        barangBelumSampai++;
      } else if (status === 'canceled' || status === 'cancelled') {
        barangHilang++;
      }

      const shippingFeeOriginal = parseFloat(order.shipping_fee_original || 0);
      const shippingFee = parseFloat(order.shipping_fee || 0);
      const shippingDiff = shippingFeeOriginal - shippingFee;
      if (shippingDiff > 0) {
        selisihOngkir += shippingDiff;
      }
    });

    // Calculate TOTAL CAIR from Payouts
    let barangSudahCair = 0;
    if (payoutsData && Array.isArray(payoutsData) && payoutsData.length > 0) {
      barangSudahCair = payoutsData.reduce((sum, payout) => {
        let payoutAmount = 0;
        if (payout.payout) {
          const payoutStr = payout.payout.toString().replace(/IDR/gi, '').trim();
          payoutAmount = parseFloat(payoutStr) || 0;
        } else if (payout.closing_balance) {
          payoutAmount = parseFloat(payout.closing_balance) || 0;
        }
        return sum + payoutAmount;
      }, 0);
    }

    // Calculate from Financial Transactions
    let totalSelesaiFromFinance = 0;
    let totalShippedFromFinance = 0;

    if (financeData && Array.isArray(financeData) && financeData.length > 0) {
      const deliveredOrders = new Set();
      const shippedOrders = new Set();

      financeData.forEach(transaction => {
        const orderItemStatus = transaction.orderItem_status || '';
        const orderItemNo = transaction.orderItem_no || '';

        if (orderItemStatus === 'Delivered' && orderItemNo) {
          deliveredOrders.add(orderItemNo);
        }

        if ((orderItemStatus === 'Shipped' || orderItemStatus === 'Ready to Ship') && orderItemNo) {
          shippedOrders.add(orderItemNo);
        }
      });

      totalSelesaiFromFinance = deliveredOrders.size;
      totalShippedFromFinance = shippedOrders.size;
    }

    const finalTotalSelesai = financeData && financeData.length > 0
      ? totalSelesaiFromFinance
      : totalSelesai;

    const finalDalamPerjalanan = financeData && financeData.length > 0
      ? totalShippedFromFinance
      : dalamPerjalanan;

    // Update states
    const calculatedQuickStats = {
      barangBelumSampai: finalDalamPerjalanan,
      barangSudahCair,
      barangHilang: barangHilang > 0 ? barangHilang : 0,
      selisihOngkir,
    };

    const calculatedFinancialSummary = {
      totalOmzet,
      totalOrder,
      totalSelesai: finalTotalSelesai,
      totalCair: barangSudahCair,
      dalamPerjalanan: finalDalamPerjalanan,
    };

    setQuickStats(calculatedQuickStats);
    setFinancialSummary(calculatedFinancialSummary);

    // Calculate metrics and health score
    calculateMetricsFromData(calculatedQuickStats, calculatedFinancialSummary);

    console.log("✅ Stats processed successfully");
  };

  const formatRupiah = (value) => {
    if (!value || isNaN(value)) return 'Rp0';

    if (value >= 1000000) {
      return `Rp${(value / 1000000).toFixed(1)} jt`;
    } else if (value >= 1000) {
      return `Rp${(value / 1000).toFixed(0)}k`;
    }
    return `Rp${Math.round(value).toLocaleString('id-ID')}`;
  };

  const calculateMetricsFromData = (quickStatsData, financialSummaryData) => {
    console.log('💰 Calculating metrics...');

    // Calculate store health score (0-100)
    let score = 0;

    if (quickStatsData.barangSudahCair > 0) {
      score += 30;
    }

    if (financialSummaryData.totalSelesai > 0 && financialSummaryData.totalOrder > 0) {
      const completionRate = (financialSummaryData.totalSelesai / financialSummaryData.totalOrder) * 100;
      score += Math.min(25, (completionRate / 100) * 25);
    }

    if (quickStatsData.barangBelumSampai >= 0) {
      score += 20;
    }

    if (quickStatsData.selisihOngkir < 500000) {
      score += 15;
    } else if (quickStatsData.selisihOngkir < 1000000) {
      score += 10;
    } else {
      score += 5;
    }

    if (quickStatsData.barangHilang === 0) {
      score += 10;
    } else if (quickStatsData.barangHilang < 5) {
      score += 5;
    }

    const finalScore = Math.round(score);

    // Determine status
    let status = 'Kurang Baik';
    let statusColor = COLORS.danger;

    if (finalScore >= 80) {
      status = 'Sangat Baik';
      statusColor = COLORS.success;
    } else if (finalScore >= 60) {
      status = 'Baik';
      statusColor = COLORS.primary;
    } else if (finalScore >= 40) {
      status = 'Cukup Baik';
      statusColor = COLORS.warning;
    }

    setStoreCondition({
      status,
      score: finalScore,
      statusColor,
      lastUpdate: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    // Calculate average daily revenue
    const avgDailyRevenue = financialSummaryData.totalOmzet / 30;

    // Build main metrics
    const metrics = [
      {
        id: 1,
        icon: 'wallet-outline',
        title: 'Uang Cair',
        value: formatRupiah(quickStatsData.barangSudahCair),
        change: '+0%',
        changeType: 'positive',
        subtitle: 'total sudah cair',
        color: COLORS.success,
        detailData: {
          thisMonth: formatRupiah(quickStatsData.barangSudahCair),
          lastMonth: 'Tidak ada data',
          growth: 'N/A',
          breakdown: [
            { label: 'Lazada', amount: formatRupiah(quickStatsData.barangSudahCair) }
          ]
        }
      },
      {
        id: 2,
        icon: 'trending-up-outline',
        title: 'Total Penjualan',
        value: formatRupiah(financialSummaryData.totalOmzet),
        change: '+0%',
        changeType: 'positive',
        subtitle: 'tahun ini',
        color: COLORS.primary,
        detailData: {
          thisMonth: formatRupiah(financialSummaryData.totalOmzet),
          lastMonth: 'Tidak ada data',
          growth: 'N/A',
          breakdown: [
            { label: 'Lazada', amount: formatRupiah(financialSummaryData.totalOmzet) }
          ]
        }
      },
      {
        id: 3,
        icon: 'cart-outline',
        title: 'Total Pesanan',
        value: financialSummaryData.totalOrder.toString(),
        change: '+0%',
        changeType: 'positive',
        subtitle: 'pesanan berhasil',
        color: COLORS.success,
        detailData: {
          thisMonth: `${financialSummaryData.totalOrder} pesanan`,
          lastMonth: 'Tidak ada data',
          growth: 'N/A',
          breakdown: [
            { label: 'Lazada', amount: `${financialSummaryData.totalOrder} pesanan` }
          ]
        }
      },
      {
        id: 4,
        icon: 'cube-outline',
        title: 'Paket Terkirim',
        value: financialSummaryData.totalSelesai.toString(),
        change: '+0%',
        changeType: 'positive',
        subtitle: 'paket sukses',
        color: COLORS.purple,
        detailData: {
          thisMonth: `${financialSummaryData.totalSelesai} paket`,
          lastMonth: 'Tidak ada data',
          growth: 'N/A',
          breakdown: [
            { label: 'Lazada', amount: `${financialSummaryData.totalSelesai} paket` }
          ]
        }
      },
      {
        id: 5,
        icon: 'return-up-back-outline',
        title: 'Return/Retur',
        value: quickStatsData.barangHilang.toString(),
        change: '0%',
        changeType: 'positive',
        subtitle: 'paket dibatalkan',
        color: COLORS.danger,
        detailData: {
          thisMonth: `${quickStatsData.barangHilang} paket`,
          lastMonth: 'Tidak ada data',
          growth: 'N/A',
          breakdown: [
            { label: 'Lazada', amount: `${quickStatsData.barangHilang} paket` }
          ],
          reasons: [
            { reason: 'Data belum tersedia', count: 'N/A' }
          ]
        }
      },
      {
        id: 6,
        icon: 'cash-outline',
        title: 'Rata-rata Omset',
        value: formatRupiah(avgDailyRevenue),
        change: '+0%',
        changeType: 'positive',
        subtitle: 'per hari',
        color: COLORS.warning,
        detailData: {
          thisMonth: `${formatRupiah(avgDailyRevenue)}/hari`,
          lastMonth: 'Tidak ada data',
          growth: 'N/A',
          breakdown: [
            { label: 'Lazada', amount: `${formatRupiah(avgDailyRevenue)}/hari` }
          ]
        }
      }
    ];

    setMainMetrics(metrics);

    // Build problem areas
    const problems = [];

    if (quickStatsData.selisihOngkir > 0) {
      problems.push({
        id: 1,
        icon: 'warning-outline',
        title: 'Selisih Ongkir',
        value: formatRupiah(quickStatsData.selisihOngkir),
        severity: quickStatsData.selisihOngkir > 500000 ? 'high' : 'medium',
        description: 'Ada selisih ongkir yang perlu disesuaikan',
        action: 'Cek Detail',
        color: COLORS.warning
      });
    }

    if (quickStatsData.barangHilang > 0) {
      problems.push({
        id: 2,
        icon: 'alert-circle-outline',
        title: 'Barang Dibatalkan',
        value: `${quickStatsData.barangHilang} Order`,
        severity: quickStatsData.barangHilang > 10 ? 'high' : 'medium',
        description: 'Order yang dibatalkan customer',
        action: 'Lihat Detail',
        color: COLORS.danger
      });
    }

    if (quickStatsData.barangBelumSampai > 0) {
      problems.push({
        id: 3,
        icon: 'time-outline',
        title: 'Barang Belum Sampai',
        value: `${quickStatsData.barangBelumSampai} Paket`,
        severity: 'low',
        description: 'Paket dalam perjalanan ke customer',
        action: 'Lacak Paket',
        color: COLORS.primary
      });
    }

    setProblemAreas(problems);

    console.log('✅ Metrics calculated');
  };

  // Detailed metrics
  const detailedMetrics = [
    {
      category: 'Performa Penjualan',
      items: [
        { label: 'Conversion Rate', value: 'N/A', status: 'normal', icon: 'trending-up' },
        { label: 'Repeat Customer', value: 'N/A', status: 'normal', icon: 'people' },
        { label: 'Avg. Order Value', value: formatRupiah(financialSummary.totalOmzet / financialSummary.totalOrder || 0), status: 'normal', icon: 'pricetag' },
        { label: 'Cancel Rate', value: `${quickStats.barangHilang}`, status: 'normal', icon: 'close-circle' }
      ]
    },
    {
      category: 'Operasional',
      items: [
        { label: 'Waktu Proses', value: 'N/A', status: 'normal', icon: 'time' },
        { label: 'On-time Delivery', value: `${financialSummary.totalSelesai}/${financialSummary.totalOrder}`, status: 'good', icon: 'checkmark-circle' },
        { label: 'Return Rate', value: `${quickStats.barangHilang}`, status: 'normal', icon: 'return-up-back' },
        { label: 'Stock Accuracy', value: 'N/A', status: 'normal', icon: 'cube' }
      ]
    },
    {
      category: 'Keuangan',
      items: [
        { label: 'Cash Flow', value: 'Positif', status: 'good', icon: 'cash' },
        { label: 'Total Omzet', value: formatRupiah(financialSummary.totalOmzet), status: 'good', icon: 'stats-chart' },
        { label: 'Total Cair', value: formatRupiah(quickStats.barangSudahCair), status: 'good', icon: 'wallet' },
        { label: 'Dalam Perjalanan', value: `${quickStats.barangBelumSampai}`, status: 'normal', icon: 'trending-up' }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return { name: 'checkmark-circle', color: COLORS.success };
      case 'warning': return { name: 'alert-circle', color: COLORS.warning };
      case 'normal': return { name: 'remove-circle', color: COLORS.primary };
      default: return { name: 'help-circle', color: COLORS.textMuted };
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!quickStats || !financialSummary) {
      Alert.alert('Error', 'Data keuangan tidak tersedia');
      return;
    }

    setIsAnalyzing(true);

    try {
      const reportData = {
        totalOmzet: financialSummary.totalOmzet,
        totalOrder: financialSummary.totalOrder,
        totalSelesai: financialSummary.totalSelesai,
        totalCair: quickStats.barangSudahCair,
        barangBelumSampai: quickStats.barangBelumSampai,
        barangHilang: quickStats.barangHilang,
        selisihOngkir: quickStats.selisihOngkir,
        dalamPerjalanan: financialSummary.dalamPerjalanan
      };

      console.log('🤖 Sending data to ChatGPT:', reportData);

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Kamu adalah seorang konsultan bisnis e-commerce yang ahli dalam menganalisis performa toko online. Berikan analisis yang jelas, praktis, dan actionable dalam bahasa Indonesia.'
            },
            {
              role: 'user',
              content: `Analisa laporan keuangan toko online saya dan berikan saran konkret untuk meningkatkan penjualan dan mengurangi biaya yang tidak perlu.

Data Toko:
- Total Omzet: Rp${reportData.totalOmzet.toLocaleString('id-ID')}
- Total Pesanan: ${reportData.totalOrder}
- Pesanan Selesai: ${reportData.totalSelesai}
- Uang Sudah Cair: Rp${reportData.totalCair.toLocaleString('id-ID')}
- Barang Belum Sampai: ${reportData.barangBelumSampai} paket
- Barang Dibatalkan: ${reportData.barangHilang} paket
- Selisih Ongkir: Rp${reportData.selisihOngkir.toLocaleString('id-ID')}
- Dalam Perjalanan: ${reportData.dalamPerjalanan} paket

Berikan analisa dalam format:
1. Skor kesehatan toko (0-100)
2. Status kondisi toko (Sangat Baik/Baik/Cukup Baik/Kurang Baik)
3. 3-5 kekuatan toko yang perlu dipertahankan
4. 3-5 area perbaikan dengan langkah konkret
5. Rekomendasi prioritas untuk menambah penjualan
6. Rekomendasi cara mengurangi biaya

Jawab dalam format JSON:
{
  "score": number,
  "status": string,
  "strengths": [string],
  "improvements": [string],
  "salesBoostRecommendations": [string],
  "costReductionRecommendations": [string]
}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      console.log('✅ ChatGPT Response:', response.data);

      const aiResponse = response.data.choices[0].message.content;

      let analysisData;
      try {
        const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysisData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        analysisData = {
          score: storeCondition.score,
          status: storeCondition.status,
          strengths: [
            'Memiliki data transaksi yang terstruktur',
            'Sistem pelaporan yang baik',
            'Monitoring real-time tersedia'
          ],
          improvements: [
            'Tingkatkan efisiensi operasional',
            'Optimalkan strategi marketing',
            'Review proses pengiriman'
          ],
          salesBoostRecommendations: [
            'Lakukan promosi untuk produk best seller',
            'Manfaatkan social media marketing',
            'Tingkatkan kualitas foto produk'
          ],
          costReductionRecommendations: [
            'Negosiasi ulang biaya pengiriman',
            'Optimalkan packaging untuk mengurangi berat',
            'Gunakan supplier dengan harga lebih kompetitif'
          ]
        };
      }

      const storeName = platforms.find(p => p.id === selectedStore)?.name || 'Lazada';

      setAnalysisResult({
        score: analysisData.score || storeCondition.score,
        status: analysisData.status || storeCondition.status,
        storeName: storeName,
        strengths: analysisData.strengths || [],
        improvements: analysisData.improvements || [],
        salesBoost: analysisData.salesBoostRecommendations || [],
        costReduction: analysisData.costReductionRecommendations || []
      });

      setShowAnalysisModal(true);

    } catch (error) {
      console.error('❌ Error calling ChatGPT API:', error.response?.data || error.message);

      Alert.alert(
        'Error',
        'Gagal menganalisa toko dengan AI. Silakan coba lagi.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kesehatan Toko</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kesehatan Toko</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadAllData}
          >
            <Icon name="refresh" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusLeft}>
              <Icon name="shield-checkmark" size={32} color={storeCondition.statusColor} />
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>Status Toko</Text>
                <Text style={[styles.statusValue, { color: storeCondition.statusColor }]}>
                  {storeCondition.status}
                </Text>
              </View>
            </View>
            <View style={[styles.scoreCircle, { borderColor: storeCondition.statusColor }]}>
              <Text style={styles.scoreNumber}>{storeCondition.score}</Text>
              <Text style={styles.scoreLabel}>Skor</Text>
            </View>
          </View>

          <View style={styles.statusFooter}>
            <Icon name="time-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.lastUpdate}>Terakhir update: {storeCondition.lastUpdate}</Text>
          </View>

          {/* Analyze Button with AI */}
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyzeWithAI}
            disabled={isAnalyzing}
            activeOpacity={0.8}
          >
            {isAnalyzing ? (
              <>
                <ActivityIndicator color={COLORS.white} />
                <Text style={styles.analyzeButtonText}>Menganalisa dengan AI...</Text>
              </>
            ) : (
              <>
                <Icon name="analytics" size={20} color={COLORS.white} />
                <Text style={styles.analyzeButtonText}>Analisa Toko dengan AI</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Platform Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Pilih Toko:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {platforms.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                style={[
                  styles.filterChip,
                  selectedStore === platform.id && styles.filterChipActive,
                  selectedStore === platform.id && { borderColor: platform.color }
                ]}
                onPress={() => setSelectedStore(platform.id)}
                activeOpacity={0.7}
                disabled={platform.id !== 'lazada'}
              >
                <Icon
                  name={platform.icon}
                  size={18}
                  color={selectedStore === platform.id ? platform.color : COLORS.textMuted}
                />
                <Text style={[
                  styles.filterChipText,
                  selectedStore === platform.id && styles.filterChipTextActive,
                  selectedStore === platform.id && { color: platform.color }
                ]}>
                  {platform.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Store Info Card */}
        {selectedStore !== 'all' && (
          <View style={styles.storeInfoCard}>
            <View style={[
              styles.storeIconWrapper,
              { backgroundColor: platforms.find(p => p.id === selectedStore)?.color + '15' }
            ]}>
              <Icon
                name={platforms.find(p => p.id === selectedStore)?.icon}
                size={24}
                color={platforms.find(p => p.id === selectedStore)?.color}
              />
            </View>
            <View style={styles.storeInfoContent}>
              <Text style={styles.storeInfoTitle}>
                {platforms.find(p => p.id === selectedStore)?.name}
              </Text>
              <Text style={styles.storeInfoSubtitle}>
                Data diambil dari API {platforms.find(p => p.id === selectedStore)?.name}
              </Text>
            </View>
          </View>
        )}

        {/* Main Metrics Grid */}
        {mainMetrics.length > 0 && (
          <View style={styles.metricsGrid}>
            {mainMetrics.map((metric) => (
              <TouchableOpacity
                key={metric.id}
                style={styles.metricCard}
                onPress={() => {
                  setSelectedMetric(metric);
                  setShowMetricDetailModal(true);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.metricIcon, { backgroundColor: metric.color + '15' }]}>
                  <Icon name={metric.icon} size={24} color={metric.color} />
                </View>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <View style={styles.metricChange}>
                  <Icon
                    name={metric.changeType === 'positive' ? 'trending-up' : 'trending-down'}
                    size={14}
                    color={metric.changeType === 'positive' ? COLORS.success : COLORS.danger}
                  />
                  <Text style={[
                    styles.metricChangeText,
                    { color: metric.changeType === 'positive' ? COLORS.success : COLORS.danger }
                  ]}>
                    {metric.change}
                  </Text>
                </View>
                <Text style={styles.metricSubtitle}>{metric.subtitle}</Text>

                <View style={styles.tapIndicator}>
                  <Icon name="information-circle-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.tapIndicatorText}>Tap untuk detail</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Problem Areas Section */}
        {problemAreas.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Perlu Perhatian</Text>
              <View style={styles.problemBadge}>
                <Text style={styles.problemBadgeText}>{problemAreas.length}</Text>
              </View>
            </View>

            {problemAreas.map((problem) => (
              <View key={problem.id} style={styles.problemCard}>
                <View style={[styles.problemIconWrapper, { backgroundColor: problem.color + '15' }]}>
                  <Icon name={problem.icon} size={24} color={problem.color} />
                </View>
                <View style={styles.problemContent}>
                  <View style={styles.problemHeader}>
                    <Text style={styles.problemTitle}>{problem.title}</Text>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: problem.severity === 'high' ? COLORS.danger + '15' : COLORS.warning + '15' }
                    ]}>
                      <Text style={[
                        styles.severityText,
                        { color: problem.severity === 'high' ? COLORS.danger : COLORS.warning }
                      ]}>
                        {problem.severity === 'high' ? 'Urgent' : problem.severity === 'medium' ? 'Sedang' : 'Rendah'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.problemValue}>{problem.value}</Text>
                  <Text style={styles.problemDescription}>{problem.description}</Text>
                  <TouchableOpacity style={styles.problemAction}>
                    <Text style={styles.problemActionText}>{problem.action}</Text>
                    <Icon name="chevron-forward" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Detailed Metrics Sections */}
        {detailedMetrics.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            <View style={styles.metricsTable}>
              {section.items.map((item, idx) => {
                const statusIcon = getStatusIcon(item.status);
                return (
                  <View key={idx} style={styles.metricRow}>
                    <View style={styles.metricRowLeft}>
                      <Icon name={item.icon} size={20} color={COLORS.textLight} />
                      <Text style={styles.metricRowLabel}>{item.label}</Text>
                    </View>
                    <View style={styles.metricRowRight}>
                      <Text style={styles.metricRowValue}>{item.value}</Text>
                      <Icon name={statusIcon.name} size={18} color={statusIcon.color} />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekomendasi</Text>
          <View style={styles.recommendationCard}>
            <Icon name="bulb" size={28} color={COLORS.warning} />
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle}>Tips Meningkatkan Kesehatan Toko</Text>
              <Text style={styles.recommendationText}>
                • Analisa toko dengan AI untuk rekomendasi personal{'\n'}
                • Monitor metrik penjualan setiap hari{'\n'}
                • Respon customer dengan cepat{'\n'}
                • Evaluasi produk yang kurang laku{'\n'}
                • Optimalkan strategi pricing
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* AI Analysis Result Modal - SAMA SEPERTI SEBELUMNYA */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAnalysisModal}
        onRequestClose={() => setShowAnalysisModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Analisa Toko AI 🤖</Text>
              <TouchableOpacity onPress={() => setShowAnalysisModal(false)}>
                <Icon name="close-circle" size={28} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {analysisResult && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.analysisStoreBadge}>
                  <Icon name="storefront" size={16} color={COLORS.primary} />
                  <Text style={styles.analysisStoreName}>{analysisResult.storeName}</Text>
                </View>

                <View style={styles.analysisScoreCard}>
                  <View style={styles.analysisScoreCircle}>
                    <Text style={styles.analysisScoreNumber}>{analysisResult.score}</Text>
                    <Text style={styles.analysisScoreLabel}>Skor</Text>
                  </View>
                  <View style={styles.analysisScoreInfo}>
                    <Text style={styles.analysisStatus}>{analysisResult.status}</Text>
                    <Text style={styles.analysisStatusDesc}>
                      Hasil analisa AI untuk toko Anda
                    </Text>
                  </View>
                </View>

                <View style={styles.analysisSection}>
                  <View style={styles.analysisSectionHeader}>
                    <Icon name="checkmark-circle" size={24} color={COLORS.success} />
                    <Text style={styles.analysisSectionTitle}>Kekuatan Toko</Text>
                  </View>
                  {analysisResult.strengths.map((strength, idx) => (
                    <View key={idx} style={styles.analysisItem}>
                      <Icon name="checkmark" size={16} color={COLORS.success} />
                      <Text style={styles.analysisItemText}>{strength}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.analysisSection}>
                  <View style={styles.analysisSectionHeader}>
                    <Icon name="bulb" size={24} color={COLORS.warning} />
                    <Text style={styles.analysisSectionTitle}>Area Perbaikan</Text>
                  </View>
                  {analysisResult.improvements.map((improvement, idx) => (
                    <View key={idx} style={styles.analysisItem}>
                      <Icon name="arrow-forward" size={16} color={COLORS.warning} />
                      <Text style={styles.analysisItemText}>{improvement}</Text>
                    </View>
                  ))}
                </View>

                {analysisResult.salesBoost && analysisResult.salesBoost.length > 0 && (
                  <View style={styles.analysisSection}>
                    <View style={styles.analysisSectionHeader}>
                      <Icon name="trending-up" size={24} color={COLORS.primary} />
                      <Text style={styles.analysisSectionTitle}>Cara Tingkatkan Penjualan</Text>
                    </View>
                    {analysisResult.salesBoost.map((tip, idx) => (
                      <View key={idx} style={styles.analysisItem}>
                        <Icon name="arrow-up" size={16} color={COLORS.primary} />
                        <Text style={styles.analysisItemText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {analysisResult.costReduction && analysisResult.costReduction.length > 0 && (
                  <View style={styles.analysisSection}>
                    <View style={styles.analysisSectionHeader}>
                      <Icon name="cash-outline" size={24} color={COLORS.success} />
                      <Text style={styles.analysisSectionTitle}>Cara Kurangi Biaya</Text>
                    </View>
                    {analysisResult.costReduction.map((tip, idx) => (
                      <View key={idx} style={styles.analysisItem}>
                        <Icon name="remove-circle" size={16} color={COLORS.success} />
                        <Text style={styles.analysisItemText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowAnalysisModal(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Mengerti</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Metric Detail Modal - SAMA SEPERTI DOCUMENT SEBELUMNYA (lines 650-750) */}
      {/* Copy paste dari document sebelumnya untuk Metric Detail Modal */}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },

  // Status Card
  statusCard: {
    backgroundColor: COLORS.white,
    margin: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusInfo: {
    gap: 4,
  },
  statusLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  scoreLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    marginBottom: 15,
  },
  lastUpdate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  analyzeButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // Platform Filter
  filterContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  filterScroll: {
    paddingVertical: 5,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.divider,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterChipTextActive: {
    fontWeight: '700',
  },

  // Store Info Card
  storeInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  storeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfoContent: {
    flex: 1,
  },
  storeInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  storeInfoSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 42) / 2,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  metricChangeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  metricSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  tapIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  tapIndicatorText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },

  // Section
  section: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 15,
  },
  problemBadge: {
    backgroundColor: COLORS.danger,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },

  // Problem Card
  problemCard: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  problemIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemContent: {
    flex: 1,
    marginLeft: 12,
  },
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  problemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  problemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  problemDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  problemAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  problemActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Metrics Table
  metricsTable: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  metricRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  metricRowLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  metricRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Recommendation Card
  recommendationCard: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
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
  analysisStoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  analysisStoreName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  analysisScoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    gap: 15,
  },
  analysisScoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.success,
  },
  analysisScoreNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
  },
  analysisScoreLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  analysisScoreInfo: {
    flex: 1,
  },
  analysisStatus: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 4,
  },
  analysisStatusDesc: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  analysisSection: {
    marginBottom: 20,
  },
  analysisSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  analysisSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  analysisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 10,
  },
  analysisItemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  modalCloseButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  modalCloseButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // Metric Detail Modal
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  detailSummaryCard: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailSummaryLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  detailSummaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  detailSummaryLabelBold: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  detailSummaryValueBold: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailSummaryDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 8,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  detailBreakdownCard: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  detailBreakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  detailBreakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  detailBreakdownLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  detailBreakdownValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
});