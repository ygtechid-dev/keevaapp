import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
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

export default function TransactionTab({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Tabs untuk status pesanan
  const tabs = [
    { id: 'semua', label: 'Semua', count: 156 },
    { id: 'unpaid', label: 'Belum Bayar', count: 12 },
    { id: 'toship', label: 'Perlu Dikirim', count: 24 },
    { id: 'shipping', label: 'Dikirim', count: 45 },
    { id: 'completed', label: 'Selesai', count: 67 },
    { id: 'cancelled', label: 'Dibatalkan', count: 8 },
  ];

  // Summary Statistics
  const statistics = [
    {
      id: 1,
      icon: 'time-outline',
      label: 'Menunggu Konfirmasi',
      value: '12',
      color: COLORS.warning,
      bgColor: COLORS.warning + '15',
    },
    {
      id: 2,
      icon: 'cube-outline',
      label: 'Siap Dikirim',
      value: '24',
      color: COLORS.info,
      bgColor: COLORS.info + '15',
    },
    {
      id: 3,
      icon: 'rocket-outline',
      label: 'Dalam Pengiriman',
      value: '45',
      color: COLORS.primary,
      bgColor: COLORS.primary + '15',
    },
    {
      id: 4,
      icon: 'checkmark-circle-outline',
      label: 'Pesanan Selesai',
      value: '67',
      color: COLORS.success,
      bgColor: COLORS.success + '15',
    },
  ];

  // Orders Data
  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-2024111600123',
      date: '16 Nov 2024, 14:30',
      customer: 'Budi Santoso',
      items: [
        { name: 'Kemeja Batik Pria Premium', qty: 2, price: 150000 },
        { name: 'Celana Chino Navy', qty: 1, price: 120000 },
      ],
      totalAmount: 420000,
      status: 'toship',
      statusLabel: 'Perlu Dikirim',
      paymentMethod: 'Transfer Bank',
      shippingMethod: 'JNE REG',
      trackingNumber: 'JNE1234567890',
      note: 'Mohon packing rapi',
    },
    {
      id: 2,
      orderNumber: 'ORD-2024111600124',
      date: '16 Nov 2024, 13:15',
      customer: 'Siti Rahayu',
      items: [
        { name: 'Dress Maxi Floral', qty: 1, price: 200000 },
      ],
      totalAmount: 200000,
      status: 'shipping',
      statusLabel: 'Sedang Dikirim',
      paymentMethod: 'COD',
      shippingMethod: 'SiCepat REG',
      trackingNumber: 'SICEPAT987654',
      note: '',
    },
    {
      id: 3,
      orderNumber: 'ORD-2024111600125',
      date: '16 Nov 2024, 12:00',
      customer: 'Ahmad Yani',
      items: [
        { name: 'Sepatu Sneakers Putih', qty: 1, price: 350000 },
        { name: 'Kaos Kaki Sport (3 Pasang)', qty: 1, price: 45000 },
      ],
      totalAmount: 395000,
      status: 'unpaid',
      statusLabel: 'Menunggu Pembayaran',
      paymentMethod: 'Transfer Bank',
      shippingMethod: 'JNT Express',
      trackingNumber: '-',
      note: '',
    },
    {
      id: 4,
      orderNumber: 'ORD-2024111600126',
      date: '15 Nov 2024, 16:45',
      customer: 'Dewi Lestari',
      items: [
        { name: 'Tas Ransel Kanvas', qty: 1, price: 180000 },
      ],
      totalAmount: 180000,
      status: 'completed',
      statusLabel: 'Pesanan Selesai',
      paymentMethod: 'OVO',
      shippingMethod: 'Grab Express',
      trackingNumber: 'GRAB123456',
      note: '',
    },
    {
      id: 5,
      orderNumber: 'ORD-2024111600127',
      date: '15 Nov 2024, 11:20',
      customer: 'Eko Wijaya',
      items: [
        { name: 'Jaket Denim Pria', qty: 1, price: 250000 },
      ],
      totalAmount: 250000,
      status: 'cancelled',
      statusLabel: 'Dibatalkan',
      paymentMethod: 'Dana',
      shippingMethod: '-',
      trackingNumber: '-',
      note: 'Pembeli membatalkan pesanan',
    },
  ];

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

  const filteredOrders = selectedTab === 'semua' 
    ? orders 
    : orders.filter(order => order.status === selectedTab);

  const handleOrderDetail = (order) => {
    navigation.navigate('DetailPesananScreen', { order });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan Pesanan</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Icon name="funnel-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Icon name="download-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

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
          {tabs.map((tab) => (
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
                    <TouchableOpacity style={styles.actionBtnSecondary}>
                      <Icon name="print-outline" size={16} color={COLORS.text} />
                      <Text style={styles.actionBtnSecondaryText}>Cetak Label</Text>
                    </TouchableOpacity>
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
                Pesanan akan muncul di sini
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Floating Action Button */}
      {/* <TouchableOpacity style={styles.fab}>
        <Icon name="add" size={28} color={COLORS.white} />
      </TouchableOpacity> */}
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

  // FAB
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});