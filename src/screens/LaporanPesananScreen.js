import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL } from '../context/APIUrl';
import axios from 'axios';
import { BLEPrinter } from '@haroldtran/react-native-thermal-printer';

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

const PRINTER_STORAGE_KEY = '@saved_printer_lazada';

// Marketplace dummy data
const DUMMY_SHOPEE_ORDERS = [
  {
    id: 'SHOPEE-001',
    orderNumber: 'SPE-2024111600001',
    date: '16 Nov 2024, 10:30',
    customer: 'Rina Wati',
    items: [
      { name: 'Kaos Polos Premium', qty: 3, price: 75000 },
    ],
    totalAmount: 225000,
    status: 'toship',
    statusLabel: 'Perlu Dikirim',
    paymentMethod: 'ShopeePay',
    shippingMethod: 'Shopee Express',
    trackingNumber: 'SPXID1234567',
    marketplace: 'shopee',
  },
  {
    id: 'SHOPEE-002',
    orderNumber: 'SPE-2024111600002',
    date: '15 Nov 2024, 14:20',
    customer: 'Joko Susilo',
    items: [
      { name: 'Hoodie Cotton Fleece', qty: 1, price: 180000 },
    ],
    totalAmount: 180000,
    status: 'completed',
    statusLabel: 'Selesai',
    paymentMethod: 'Transfer Bank',
    shippingMethod: 'JNE REG',
    trackingNumber: 'JNE9876543',
    marketplace: 'shopee',
  },
];

const DUMMY_TIKTOK_ORDERS = [
  {
    id: 'TIKTOK-001',
    orderNumber: 'TT-2024111600001',
    date: '16 Nov 2024, 11:45',
    customer: 'Maya Sari',
   items: [
      { name: 'Dress Casual Modern', qty: 1, price: 150000 },
    ],
    totalAmount: 150000,
    status: 'shipping',
    statusLabel: 'Sedang Dikirim',
    paymentMethod: 'COD',
    shippingMethod: 'SiCepat',
    trackingNumber: 'SICEPAT123',
    marketplace: 'tiktok',
  },
];

const DUMMY_TOKOPEDIA_ORDERS = [
  {
    id: 'TOKPED-001',
    orderNumber: 'TKP-2024111600001',
    date: '15 Nov 2024, 09:15',
    customer: 'Andi Pratama',
    items: [
      { name: 'Celana Jeans Slim Fit', qty: 2, price: 200000 },
    ],
    totalAmount: 400000,
    status: 'unpaid',
    statusLabel: 'Menunggu Pembayaran',
    paymentMethod: 'Transfer Bank',
    shippingMethod: 'Grab Express',
    trackingNumber: '-',
    marketplace: 'tokopedia',
  },
];

export default function LaporanPesananScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [showMarketplaceFilter, setShowMarketplaceFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  
  // Date filter states
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Lazada orders
  const [lazadaOrders, setLazadaOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination for Lazada
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Print AWB loading
  const [printingOrderId, setPrintingOrderId] = useState(null);

  // Printer states
  const [printerModal, setPrinterModal] = useState(false);
  const [printerList, setPrinterList] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState(null);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [scanningPrinter, setScanningPrinter] = useState(false);
  const [connectingPrinter, setConnectingPrinter] = useState(false);

  const marketplaces = [
    { id: 'all', label: 'Semua Marketplace', icon: 'grid-outline' },
    { id: 'shopee', label: 'Shopee', icon: 'bag-outline', color: '#EE4D2D' },
    { id: 'tiktok', label: 'TikTok Shop', icon: 'musical-notes-outline', color: '#000000' },
    { id: 'tokopedia', label: 'Tokopedia', icon: 'storefront-outline', color: '#42B549' },
    { id: 'lazada', label: 'Lazada', icon: 'cart-outline', color: '#0F156D' },
  ];

  // Tabs untuk status pesanan
  const tabs = [
    { id: 'semua', label: 'Semua', count: 0 },
    { id: 'unpaid', label: 'Belum Bayar', count: 0 },
    { id: 'toship', label: 'Perlu Dikirim', count: 0 },
    { id: 'shipping', label: 'Dikirim', count: 0 },
    { id: 'completed', label: 'Selesai', count: 0 },
    { id: 'cancelled', label: 'Dibatalkan', count: 0 },
  ];

  useEffect(() => {
    loadSavedPrinter();
  }, []);

  useEffect(() => {
    if (selectedMarketplace === 'lazada') {
      setLazadaOrders([]);
      setCurrentOffset(0);
      setHasMoreOrders(true);
      fetchLazadaOrders(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarketplace, startDate, endDate]);

  // ==================== PRINTER FUNCTIONS ====================

  const loadSavedPrinter = async () => {
    try {
      const savedPrinter = await AsyncStorage.getItem(PRINTER_STORAGE_KEY);
      if (savedPrinter) {
        const printer = JSON.parse(savedPrinter);
        setCurrentPrinter(printer);
        await autoConnectPrinter(printer);
      }
    } catch (err) {
      console.log('Error loading saved printer:', err);
    }
  };

  const savePrinter = async (printer) => {
    try {
      await AsyncStorage.setItem(PRINTER_STORAGE_KEY, JSON.stringify(printer));
    } catch (err) {
      console.log('Error saving printer:', err);
    }
  };

  const requestBluetoothPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const autoConnectPrinter = async (printer) => {
    const permission = await requestBluetoothPermission();
    if (!permission) return;

    try {
      await BLEPrinter.init();
      await BLEPrinter.connectPrinter(printer.inner_mac_address);
      setPrinterConnected(true);
      console.log('Auto connected to printer:', printer.device_name);
    } catch (err) {
      console.log('Auto connect failed:', err);
      setPrinterConnected(false);
    }
  };

  const scanPrinters = async () => {
    const permission = await requestBluetoothPermission();
    if (!permission) {
      Alert.alert('Permission Ditolak', 'Izinkan akses Bluetooth untuk mencari printer');
      return;
    }

    setScanningPrinter(true);
    setPrinterList([]);

    try {
      await BLEPrinter.init();
      const devices = await BLEPrinter.getDeviceList();
      setPrinterList(devices);
      
      if (devices.length === 0) {
        Alert.alert('Info', 'Tidak ada printer ditemukan. Pastikan printer dalam mode pairing.');
      }
    } catch (err) {
      console.log('Scan error:', err);
      Alert.alert('Error', 'Gagal mencari printer. Pastikan Bluetooth aktif.');
    }
    setScanningPrinter(false);
  };

  const connectToPrinter = async (printer) => {
    setConnectingPrinter(true);
    try {
      await BLEPrinter.connectPrinter(printer.inner_mac_address);
      setCurrentPrinter(printer);
      setPrinterConnected(true);
      await savePrinter(printer);
      
      Alert.alert('Berhasil', `Terhubung ke ${printer.device_name}`);
      setPrinterModal(false);
    } catch (err) {
      console.log('Connect error:', err);
      Alert.alert('Gagal', 'Tidak dapat terhubung ke printer. Coba lagi.');
      setPrinterConnected(false);
    }
    setConnectingPrinter(false);
  };

  const disconnectPrinter = async () => {
    Alert.alert(
      'Putuskan Koneksi',
      `Yakin ingin memutuskan koneksi dari ${currentPrinter?.device_name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Putuskan',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(PRINTER_STORAGE_KEY);
              setCurrentPrinter(null);
              setPrinterConnected(false);
              Alert.alert('Berhasil', 'Printer terputus');
            } catch (err) {
              console.log('Disconnect error:', err);
            }
          },
        },
      ]
    );
  };

  // ==================== LAZADA API FUNCTIONS ====================

  const fetchLazadaOrders = async (offset = 0, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const lazadaTokenData = await AsyncStorage.getItem('lazada_token');
      if (!lazadaTokenData) {
        setError('Token Lazada tidak ditemukan. Silakan login terlebih dahulu.');
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const tokenData = JSON.parse(lazadaTokenData);
      const accessToken = tokenData.access_token;

      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      const limit = 20;

      const response = await axios.post(
        `${API_URL}/api/lazada/orders`,
        {
          access_token: accessToken,
          created_after: formattedStartDate,
          created_before: formattedEndDate,
          limit: limit.toString(),
          offset: offset.toString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('RESPONSE LAZADA:', response.data);

      const orders = response.data.data || [];
      
      console.log('ORDERS LAZADA:', orders);
      console.log('JUMLAH ORDERS:', orders.length);

      const transformedOrders = transformLazadaOrders(orders);
      
      if (append) {
        setLazadaOrders(prev => [...prev, ...transformedOrders]);
      } else {
        setLazadaOrders(transformedOrders);
      }
      
      if (orders.length < limit) {
        setHasMoreOrders(false);
      } else {
        setHasMoreOrders(true);
      }
      
      setCurrentOffset(offset);
      
    } catch (err) {
      console.error('Error fetching Lazada orders:', err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat pesanan Lazada');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreOrders = () => {
    if (!loadingMore && hasMoreOrders) {
      const nextOffset = currentOffset + 20;
      fetchLazadaOrders(nextOffset, true);
    }
  };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00+07:00`;
  };

  const transformLazadaOrders = (orders) => {
    if (!Array.isArray(orders)) {
      console.log('Orders bukan array:', orders);
      return [];
    }

    return orders.map((order) => {
      let status = 'pending';
      let statusLabel = 'Pending';
      
      if (order.statuses && Array.isArray(order.statuses) && order.statuses.length > 0) {
        const lazadaStatus = order.statuses[0].toLowerCase();
        switch (lazadaStatus) {
          case 'unpaid':
            status = 'unpaid';
            statusLabel = 'Belum Bayar';
            break;
          case 'pending':
          case 'ready_to_ship':
            status = 'toship';
            statusLabel = 'Perlu Dikirim';
            break;
          case 'shipped':
          case 'delivered':
            status = 'shipping';
            statusLabel = 'Sedang Dikirim';
            break;
          case 'completed':
            status = 'completed';
            statusLabel = 'Selesai';
            break;
          case 'canceled':
          case 'cancelled':
            status = 'cancelled';
            statusLabel = 'Dibatalkan';
            break;
          default:
            status = 'pending';
            statusLabel = lazadaStatus;
        }
      }

      let customerName = 'Pembeli Lazada';
      if (order.customer_first_name) {
        customerName = order.customer_first_name;
        if (order.customer_last_name) {
          customerName += ' ' + order.customer_last_name;
        }
      } else if (order.address_shipping && order.address_shipping.first_name) {
        customerName = order.address_shipping.first_name;
        if (order.address_shipping.last_name) {
          customerName += ' ' + order.address_shipping.last_name;
        }
      }

      const items = [];
      if (order.items && Array.isArray(order.items) && order.items.length > 0) {
        order.items.forEach(item => {
          items.push({
            name: item.name || 'Produk Lazada',
            qty: 1,
            price: parseFloat(item.paid_price || item.item_price || 0),
            package_id: item.package_id || null,
          });
        });
      } else {
        items.push({
          name: `${order.items_count || 1} item(s)`,
          qty: order.items_count || 1,
          price: parseFloat(order.price || 0),
          package_id: null,
        });
      }

      const totalAmount = parseFloat(order.price || 0);

      return {
        id: `LAZADA-${order.order_id}`,
        orderNumber: order.order_number?.toString() || order.order_id?.toString(),
        date: formatLazadaDate(order.created_at),
        customer: customerName,
        items: items,
        totalAmount: totalAmount,
        status: status,
        statusLabel: statusLabel,
        paymentMethod: order.payment_method || 'COD',
        shippingMethod: order.delivery_info || 'Lazada Logistics',
        trackingNumber: order.delivery_info || '-',
        marketplace: 'lazada',
        note: order.buyer_note || order.remarks || '',
        address: order.address_shipping,
        rawData: order,
      };
    });
  };

  const formatLazadaDate = (dateString) => {
    if (!dateString) return '-';

    try {
      const safeDate = dateString.replace(' ', 'T').replace(' ', '');
      const date = new Date(safeDate);

      if (isNaN(date.getTime())) return dateString;

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    } catch (e) {
      return dateString;
    }
  };

  // ==================== PRINT AWB FUNCTION ====================

  const handlePrintAWB = async (order) => {
    if (!printerConnected || !currentPrinter) {
      Alert.alert(
        'Printer Tidak Terhubung',
        'Hubungkan printer terlebih dahulu sebelum mencetak.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Hubungkan', onPress: () => setPrinterModal(true) },
        ]
      );
      return;
    }

    try {
      setPrintingOrderId(order.id);
      
      // Get package IDs from order items
      const packageIds = order.items
        .map(item => item.package_id)
        .filter(id => id);
      
      if (packageIds.length === 0) {
        Alert.alert('Error', 'Package ID tidak ditemukan untuk pesanan ini');
        setPrintingOrderId(null);
        return;
      }

      console.log('Package IDs:', packageIds);

      // Get access token
      const lazadaTokenData = await AsyncStorage.getItem('lazada_token');
      if (!lazadaTokenData) {
        Alert.alert('Error', 'Token Lazada tidak ditemukan');
        setPrintingOrderId(null);
        return;
      }

      const tokenData = JSON.parse(lazadaTokenData);
      const accessToken = tokenData.access_token;

      // Call print AWB API
      const response = await axios.post(
        `${API_URL}/api/lazada/print-awb`,
        {
          access_token: accessToken,
          doc_type: 'PDF',
          packages: packageIds,
          print_item_list: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Print AWB Response:', response.data);

      if (response.data.success && response.data.base64) {
        // Convert base64 PDF to printable text
        await printPDFLabel(order, response.data.base64);
      } else {
        Alert.alert('Error', 'Gagal mendapatkan label pengiriman');
      }

    } catch (err) {
      console.error('Print AWB Error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Gagal mencetak label pengiriman');
    } finally {
      setPrintingOrderId(null);
    }
  };

  const printPDFLabel = async (order, base64PDF) => {
    try {
      // Format label text untuk thermal printer
      let content = '';
      content += '\n';
      content += '================================\n';
      content += '    LAZADA SHIPPING LABEL\n';
      content += '================================\n\n';
      content += `Order No  : ${order.orderNumber}\n`;
      content += `Date      : ${order.date}\n`;
      content += '--------------------------------\n';
      content += 'PENERIMA:\n';
      content += `${order.customer}\n`;
      
      if (order.address) {
        if (order.address.phone) {
          content += `Tel: ${order.address.phone}\n`;
        }
        if (order.address.address1) {
          content += `${order.address.address1}\n`;
        }
        if (order.address.address2) {
          content += `${order.address.address2}\n`;
        }
        if (order.address.city) {
          content += `${order.address.city}\n`;
        }
        if (order.address.post_code) {
          content += `Kode Pos: ${order.address.post_code}\n`;
        }
      }
      
      content += '--------------------------------\n';
      content += 'ITEM:\n';
      order.items.forEach((item, i) => {
        content += `${i + 1}. ${item.name}\n`;
        content += `   Qty: ${item.qty}\n`;
      });
      
      content += '--------------------------------\n';
      content += `Payment: ${order.paymentMethod}\n`;
      content += `Shipping: ${order.shippingMethod}\n`;
      
      if (order.note) {
        content += `\nNote: ${order.note}\n`;
      }
      
      content += '================================\n';
      content += '\n** PDF LABEL TERSEDIA **\n';
      content += 'Silakan download dari sistem\n';
      content += 'untuk label lengkap\n';
      content += '================================\n\n\n';

      await BLEPrinter.printText(content);
      
      Alert.alert('Berhasil', 'Label pengiriman berhasil dicetak!');
      console.log('Print success');
      
    } catch (err) {
      console.log('Print error:', err);
      Alert.alert('Gagal', 'Gagal mencetak label. Pastikan printer terhubung.');
    }
  };

  // ==================== HELPER FUNCTIONS ====================

  const getAllOrders = () => {
    let allOrders = [];
    
    if (selectedMarketplace === 'all') {
      allOrders = [
        ...DUMMY_SHOPEE_ORDERS,
        ...DUMMY_TIKTOK_ORDERS,
        ...DUMMY_TOKOPEDIA_ORDERS,
        ...lazadaOrders,
      ];
    } else if (selectedMarketplace === 'shopee') {
      allOrders = DUMMY_SHOPEE_ORDERS;
    } else if (selectedMarketplace === 'tiktok') {
      allOrders = DUMMY_TIKTOK_ORDERS;
    } else if (selectedMarketplace === 'tokopedia') {
      allOrders = DUMMY_TOKOPEDIA_ORDERS;
    } else if (selectedMarketplace === 'lazada') {
      allOrders = lazadaOrders;
    }

    return allOrders;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'unpaid': return COLORS.warning;
      case 'toship': return COLORS.info;
      case 'shipping': return COLORS.primary;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.danger;
      default: return COLORS.textMuted;
    }
  };

  const allOrders = getAllOrders();
  
  // Apply search filter
  const searchFilteredOrders = searchQuery.length > 0
    ? allOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allOrders;
  
  // Apply tab filter
  const filteredOrders = selectedTab === 'semua' 
    ? searchFilteredOrders 
    : searchFilteredOrders.filter(order => order.status === selectedTab);

  // Update tab counts
  const updatedTabs = tabs.map(tab => {
    if (tab.id === 'semua') {
      return { ...tab, count: searchFilteredOrders.length };
    }
    return {
      ...tab,
      count: searchFilteredOrders.filter(order => order.status === tab.id).length
    };
  });

  // Calculate statistics
  const statistics = [
    {
      id: 1,
      icon: 'time-outline',
      label: 'Menunggu Konfirmasi',
      value: searchFilteredOrders.filter(o => o.status === 'unpaid').length.toString(),
      color: COLORS.warning,
      bgColor: COLORS.warning + '15',
    },
    {
      id: 2,
      icon: 'cube-outline',
      label: 'Siap Dikirim',
      value: searchFilteredOrders.filter(o => o.status === 'toship').length.toString(),
      color: COLORS.info,
      bgColor: COLORS.info + '15',
    },
    {
      id: 3,
      icon: 'rocket-outline',
      label: 'Dalam Pengiriman',
      value: searchFilteredOrders.filter(o => o.status === 'shipping').length.toString(),
      color: COLORS.primary,
      bgColor: COLORS.primary + '15',
    },
    {
      id: 4,
      icon: 'checkmark-circle-outline',
      label: 'Pesanan Selesai',
      value: searchFilteredOrders.filter(o => o.status === 'completed').length.toString(),
      color: COLORS.success,
      bgColor: COLORS.success + '15',
    },
  ];

  const handleOrderDetail = (order) => {
    navigation.navigate('DetailPesananScreen', { order });
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // ==================== PRINTER MODAL COMPONENT ====================

  const PrinterModal = () => (
    <Modal
      visible={printerModal}
      transparent
      animationType="slide"
      onRequestClose={() => setPrinterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.printerModalContainer}>
          <View style={styles.printerModalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Icon name="print-outline" size={24} color={COLORS.primary} />
              <Text style={styles.printerModalTitle}>Pengaturan Printer</Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setPrinterModal(false)}
            >
              <Icon name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.printerModalContent}>
            <View style={styles.printerStatusCard}>
              <View style={styles.printerStatusHeader}>
                <Text style={styles.printerStatusTitle}>Status Koneksi</Text>
                <View
                  style={[
                    styles.printerStatusBadge,
                    {
                      backgroundColor: printerConnected ? '#E8F5E9' : '#FFEBEE',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.printerStatusDot,
                      {
                        backgroundColor: printerConnected ? COLORS.success : COLORS.danger,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.printerStatusText,
                      {
                        color: printerConnected ? COLORS.success : COLORS.danger,
                      },
                    ]}
                  >
                    {printerConnected ? 'Terhubung' : 'Tidak Terhubung'}
                  </Text>
                </View>
              </View>

              {currentPrinter && (
                <View style={styles.currentPrinterInfo}>
                  <View style={styles.currentPrinterIcon}>
                    <Icon name="print" size={32} color={COLORS.success} />
                  </View>
                  <View style={styles.currentPrinterDetails}>
                    <Text style={styles.currentPrinterName}>
                      {currentPrinter.device_name}
                    </Text>
                    <Text style={styles.currentPrinterMac}>
                      {currentPrinter.inner_mac_address}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.disconnectButton}
                    onPress={disconnectPrinter}
                  >
                    <Icon name="link" size={20} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              )}

              {!currentPrinter && (
                <View style={styles.noPrinterInfo}>
                  <Icon name="print-outline" size={48} color={COLORS.border} />
                  <Text style={styles.noPrinterText}>
                    Belum ada printer terhubung
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={scanPrinters}
              disabled={scanningPrinter}
            >
              {scanningPrinter ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Icon name="bluetooth" size={20} color={COLORS.white} />
              )}
              <Text style={styles.scanButtonText}>
                {scanningPrinter ? 'Mencari Printer...' : 'Cari Printer Bluetooth'}
              </Text>
            </TouchableOpacity>

            {printerList.length > 0 && (
              <View style={styles.printerListSection}>
                <Text style={styles.printerListTitle}>
                  Printer Ditemukan ({printerList.length})
                </Text>

                {printerList.map((printer, index) => {
                  const isCurrentPrinter =
                    currentPrinter?.inner_mac_address === printer.inner_mac_address;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.printerItem,
                        isCurrentPrinter && styles.printerItemActive,
                      ]}
                      onPress={() => !isCurrentPrinter && connectToPrinter(printer)}
                      disabled={connectingPrinter || isCurrentPrinter}
                    >
                      <View style={styles.printerItemIcon}>
                        <Icon
                          name={isCurrentPrinter ? 'checkmark-circle' : 'print-outline'}
                          size={24}
                          color={isCurrentPrinter ? COLORS.success : COLORS.primary}
                        />
                      </View>
                      <View style={styles.printerItemInfo}>
                        <Text
                          style={[
                            styles.printerItemName,
                            isCurrentPrinter && styles.printerItemNameActive,
                          ]}
                        >
                          {printer.device_name || 'Unknown Device'}
                        </Text>
                        <Text style={styles.printerItemMac}>
                          {printer.inner_mac_address}
                        </Text>
                      </View>
                      {isCurrentPrinter ? (
                        <View style={styles.connectedBadge}>
                          <Text style={styles.connectedBadgeText}>Terhubung</Text>
                        </View>
                      ) : connectingPrinter ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                      ) : (
                        <Icon name="chevron-forward" size={24} color={COLORS.border} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <View style={styles.printerTips}>
              <Icon name="bulb-outline" size={20} color={COLORS.warning} />
              <View style={styles.printerTipsContent}>
                <Text style={styles.printerTipsTitle}>Tips</Text>
                <Text style={styles.printerTipsText}>
                  • Pastikan printer dalam keadaan menyala{'\n'}
                  • Aktifkan Bluetooth pada perangkat{'\n'}
                  • Pastikan printer dalam mode pairing
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // ==================== RENDER ====================

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan Pesanan</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.printerHeaderButton,
              {
                backgroundColor: printerConnected ? '#E8F5E9' : '#FFEBEE',
              },
            ]}
            onPress={() => setPrinterModal(true)}
          >
            <Icon
              name={printerConnected ? 'print' : 'print-outline'}
              size={18}
              color={printerConnected ? COLORS.success : COLORS.danger}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconBtn}
            onPress={() => setShowMarketplaceFilter(true)}
          >
            <Icon name="funnel-outline" size={22} color={COLORS.text} />
            {selectedMarketplace !== 'all' && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
          {selectedMarketplace === 'lazada' && (
            <TouchableOpacity 
              style={styles.headerIconBtn}
              onPress={() => setShowDateFilter(true)}
            >
              <Icon name="calendar-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerIconBtn}>
            <Icon name="download-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Marketplace Filter Indicator */}
      {selectedMarketplace !== 'all' && (
        <View style={styles.filterIndicator}>
          <Icon 
            name={marketplaces.find(m => m.id === selectedMarketplace)?.icon} 
            size={16} 
            color={COLORS.white} 
          />
          <Text style={styles.filterIndicatorText}>
            {marketplaces.find(m => m.id === selectedMarketplace)?.label}
          </Text>
          <TouchableOpacity onPress={() => setSelectedMarketplace('all')}>
            <Icon name="close-circle" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nomor pesanan, nama pembeli..."
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat pesanan Lazada...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={48} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchLazadaOrders(0)}
          >
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Statistics Cards */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.statsScroll}
          >
            {statistics.map((stat) => (
              <TouchableOpacity key={stat.id} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                  <Icon name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            {updatedTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tab,
                  selectedTab === tab.id && styles.tabActive
                ]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Text style={[
                  styles.tabText,
                  selectedTab === tab.id && styles.tabTextActive
                ]}>
                  {tab.label}
                </Text>
                <View style={[
                  styles.tabBadge,
                  selectedTab === tab.id && styles.tabBadgeActive
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    selectedTab === tab.id && styles.tabBadgeTextActive
                  ]}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Orders List */}
          <View style={styles.ordersContainer}>
            {filteredOrders.map((order) => (
              <TouchableOpacity 
                key={order.id} 
                style={styles.orderCard}
                onPress={() => handleOrderDetail(order)}
                activeOpacity={0.7}
              >
                {/* Marketplace Badge */}
                {order.marketplace && (
                  <View style={[
                    styles.marketplaceBadge,
                    { backgroundColor: marketplaces.find(m => m.id === order.marketplace)?.color || COLORS.primary }
                  ]}>
                    <Icon 
                      name={marketplaces.find(m => m.id === order.marketplace)?.icon} 
                      size={12} 
                      color={COLORS.white} 
                    />
                    <Text style={styles.marketplaceBadgeText}>
                      {marketplaces.find(m => m.id === order.marketplace)?.label}
                    </Text>
                  </View>
                )}

                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Icon name="receipt-outline" size={16} color={COLORS.textLight} />
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(order.status) + '15' }
                  ]}>
                    <Text style={[
                      styles.statusText, 
                      { color: getStatusColor(order.status) }
                    ]}>
                      {order.statusLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderMeta}>
                  <View style={styles.orderMetaItem}>
                    <Icon name="calendar-outline" size={14} color={COLORS.textMuted} />
                    <Text style={styles.orderMetaText}>{order.date}</Text>
                  </View>
                  <View style={styles.orderMetaItem}>
                    <Icon name="person-outline" size={14} color={COLORS.textMuted} />
                    <Text style={styles.orderMetaText}>{order.customer}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Order Items */}
                {order.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <View style={styles.orderItemLeft}>
                      <View style={styles.productImagePlaceholder}>
                        <Icon name="image-outline" size={24} color={COLORS.textMuted} />
                      </View>
                      <View style={styles.orderItemInfo}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text style={styles.productQty}>x{item.qty}</Text>
                      </View>
                    </View>
                    <Text style={styles.productPrice}>
                      Rp{item.price.toLocaleString('id-ID')}
                    </Text>
                  </View>
                ))}

                <View style={styles.divider} />

                {/* Order Footer */}
                <View style={styles.orderFooter}>
                  <View style={styles.orderFooterLeft}>
                    <View style={styles.paymentInfo}>
                      <Icon name="wallet-outline" size={14} color={COLORS.textMuted} />
                      <Text style={styles.paymentText}>{order.paymentMethod}</Text>
                    </View>
                    {order.shippingMethod !== '-' && (
                      <View style={styles.shippingInfo}>
                        <Icon name="car-outline" size={14} color={COLORS.textMuted} />
                        <Text style={styles.shippingText}>{order.shippingMethod}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.totalAmount}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      Rp{order.totalAmount.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.orderActions}>
                  {order.status === 'unpaid' && (
                    <TouchableOpacity style={styles.actionBtnSecondary}>
                      <Text style={styles.actionBtnSecondaryText}>Ingatkan Pembeli</Text>
                    </TouchableOpacity>
                  )}
                  {order.status === 'toship' && (
                    <>
                      {order.marketplace === 'lazada' ? (
                        <TouchableOpacity 
                          style={styles.actionBtnSecondary}
                          onPress={() => handlePrintAWB(order)}
                          disabled={printingOrderId === order.id}
                        >
                          {printingOrderId === order.id ? (
                            <ActivityIndicator size="small" color={COLORS.text} />
                          ) : (
                            <>
                              <Icon name="print-outline" size={16} color={COLORS.text} />
                              <Text style={styles.actionBtnSecondaryText}>Cetak Label</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={styles.actionBtnSecondary}>
                          <Icon name="print-outline" size={16} color={COLORS.text} />
                          <Text style={styles.actionBtnSecondaryText}>Cetak Label</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.actionBtnPrimary}>
                        <Icon name="checkmark" size={16} color={COLORS.white} />
                        <Text style={styles.actionBtnPrimaryText}>Atur Pengiriman</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {order.status === 'shipping' && (
                    <TouchableOpacity style={styles.actionBtnSecondary}>
                      <Icon name="location-outline" size={16} color={COLORS.text} />
                      <Text style={styles.actionBtnSecondaryText}>Lacak Paket</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.actionBtnDetail}
                    onPress={() => handleOrderDetail(order)}
                  >
                    <Text style={styles.actionBtnDetailText}>Lihat Detail</Text>
                    <Icon name="chevron-forward" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {filteredOrders.length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="document-outline" size={64} color={COLORS.textMuted} />
                <Text style={styles.emptyStateText}>Tidak ada pesanan</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery ? 'Coba kata kunci lain' : 'Pesanan akan muncul di sini'}
                </Text>
              </View>
            )}

            {/* Load More Button for Lazada */}
            {selectedMarketplace === 'lazada' && hasMoreOrders && filteredOrders.length > 0 && (
              <TouchableOpacity 
                style={styles.loadMoreButton}
                onPress={loadMoreOrders}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <>
                    <Icon name="refresh-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.loadMoreText}>Muat Lebih Banyak</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {/* Marketplace Filter Modal */}
      <Modal
        visible={showMarketplaceFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMarketplaceFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Marketplace</Text>
              <TouchableOpacity onPress={() => setShowMarketplaceFilter(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {marketplaces.map((marketplace) => (
                <TouchableOpacity
                  key={marketplace.id}
                  style={[
                    styles.marketplaceOption,
                    selectedMarketplace === marketplace.id && styles.marketplaceOptionActive
                  ]}
                  onPress={() => {
                    setSelectedMarketplace(marketplace.id);
                    setShowMarketplaceFilter(false);
                  }}
                >
                  <View style={styles.marketplaceOptionLeft}>
                    <Icon 
                      name={marketplace.icon} 
                      size={24} 
                      color={marketplace.color || COLORS.text} 
                    />
                    <Text style={styles.marketplaceOptionText}>
                      {marketplace.label}
                    </Text>
                  </View>
                  {selectedMarketplace === marketplace.id && (
                    <Icon name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Filter Modal */}
      <Modal
        visible={showDateFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Tanggal</Text>
              <TouchableOpacity onPress={() => setShowDateFilter(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.dateFilterSection}>
                <Text style={styles.dateFilterLabel}>Tanggal Mulai</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Icon name="calendar-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onStartDateChange}
                  />
                )}
              </View>

              <View style={styles.dateFilterSection}>
                <Text style={styles.dateFilterLabel}>Tanggal Akhir</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Icon name="calendar-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onEndDateChange}
                  />
                )}
              </View>

              <TouchableOpacity 
                style={styles.applyFilterButton}
                onPress={() => {
                  setShowDateFilter(false);
                  setLazadaOrders([]);
                  setCurrentOffset(0);
                  setHasMoreOrders(true);
                  fetchLazadaOrders(0);
                }}
              >
                <Text style={styles.applyFilterButtonText}>Terapkan Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Printer Modal */}
      <PrinterModal />
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
    gap: 12,
  },
  headerIconBtn: {
    padding: 4,
    position: 'relative',
  },
  printerHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },

  // Filter Indicator
  filterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 8,
  },
  filterIndicatorText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },

  // Search
  searchContainer: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  // Loading & Error
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
    paddingVertical: 60,
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

  // Statistics
  statsScroll: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Tabs
  tabsContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    gap: 6,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  tabBadgeTextActive: {
    color: COLORS.white,
  },

  // Orders
  ordersContainer: {
    paddingHorizontal: 15,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  marketplaceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
    gap: 4,
  },
  marketplaceBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 12,
  },
  orderMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderMetaText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },

  // Order Items
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderItemLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  productQty: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Order Footer
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  orderFooterLeft: {
    gap: 6,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  shippingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shippingText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  totalAmount: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Actions
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    gap: 4,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    gap: 4,
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionBtnDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
  },
  actionBtnDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Load More
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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

  // Marketplace Options
  marketplaceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginBottom: 10,
  },
  marketplaceOptionActive: {
    backgroundColor: COLORS.primary + '10',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  marketplaceOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  marketplaceOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Date Filter
  dateFilterSection: {
    marginBottom: 20,
  },
  dateFilterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  dateButtonText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  applyFilterButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  applyFilterButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },

  // Printer Modal
  printerModalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  printerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  printerModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 10,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  printerModalContent: {
    padding: 20,
  },
  printerStatusCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  printerStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  printerStatusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  printerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  printerStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  printerStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  currentPrinterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
  },
  currentPrinterIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPrinterDetails: {
    flex: 1,
    marginLeft: 12,
  },
  currentPrinterName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  currentPrinterMac: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  disconnectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPrinterInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noPrinterText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  scanButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  printerListSection: {
    marginBottom: 20,
  },
  printerListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  printerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  printerItemActive: {
    borderColor: COLORS.success,
    backgroundColor: '#F0FFF4',
  },
  printerItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  printerItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  printerItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  printerItemNameActive: {
    color: COLORS.success,
  },
  printerItemMac: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  connectedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  printerTips: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F7DC6F',
    marginBottom: 20,
  },
  printerTipsContent: {
    flex: 1,
    marginLeft: 12,
  },
  printerTipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9A7B0A',
    marginBottom: 4,
  },
  printerTipsText: {
    fontSize: 12,
    color: '#7D6608',
    lineHeight: 18,
  },
});