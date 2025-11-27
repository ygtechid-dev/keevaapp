import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
};

export default function BarangBelumSampaiScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('Today');

  const filters = ['Today', 'Rajuktav', 'Buyer'];

  const orders = [
    {
      id: 1,
      orderNumber: '63/9010001',
      status: 'Sedang\nDikirim',
      customer: 'Eri Eriawan',
      buyer: '9 Produk',
      date: 'Rabu, 27 Oktober 2025 - 10:21 WIB',
    },
    {
      id: 2,
      orderNumber: '619000011',
      status: 'Sedang\nTransit',
      customer: 'Ari Wibowo',
      buyer: '01 November 2025 - 11:12 WIB',
        date: 'Rabu, 27 Oktober 2025 - 10:21 WIB',

    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Icon name="apps-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Barang Belum Sampai</Text>
        <TouchableOpacity style={styles.filterDropdown}>
          <Text style={styles.filterText}>{selectedFilter}</Text>
          <Icon name="chevron-down" size={16} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Cards */}
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderLeft}>
                <Text style={styles.orderLabel}>Order ID</Text>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.customerInfo}>{order.customer}</Text>
                {order.date && (
                  <Text style={styles.dateText}>{order.date}</Text>
                )}
              </View>

              <View style={styles.orderRight}>
                <View style={[styles.statusBadge, { 
                  backgroundColor: order.id === 1 ? COLORS.success + '20' : COLORS.danger + '20' 
                }]}>
                  <Text style={[styles.statusText, { 
                    color: order.id === 1 ? COLORS.success : COLORS.danger 
                  }]}>
                    {order.status}
                  </Text>
                </View>
                <Text style={styles.buyerText}>{order.buyer}</Text>
              </View>
            </View>

            <View style={styles.orderActions}>
             
              {/* <TouchableOpacity style={styles.klaimBtn} onPress={() =>  navigation.navigate('FormKlaimScreen', { claimType: 'Barang Hilang' })}>
                <Text style={styles.klaimBtnText}>Ajukan Klaim</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        ))}

        {/* Order Summary Cards */}
        {/* <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Order Riluka Cair</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
          </View>
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Order Numer</Text>
              <Text style={styles.summaryValue}>61900001</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>RI siutrn Meyzna\nPalam 24 Allina</Text>
              <Text style={styles.summaryValue}>26 unsuur</Text>
            </View>
          </View>
          <View style={styles.summaryActions}>
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={styles.detailBtnText}>Detail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.klaimBtn}>
              <Text style={styles.klaimBtnText}>Ajukan Klaim</Text>
            </TouchableOpacity>
          </View>
        </View> */}

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
    paddingTop: 30,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },

  // Title Section
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Order Card
  orderCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  orderLeft: {
    flex: 1,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  customerInfo: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 13,
  },
  buyerText: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Order Actions
  orderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  detailBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },
  klaimBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  klaimBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryContent: {
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    flex: 1,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 10,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});