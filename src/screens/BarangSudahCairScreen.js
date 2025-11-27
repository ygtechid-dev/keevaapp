import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

export default function BarangSudahCairScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('Hari Ini');

  const filters = ['Hari Ini', 'Buyer', 'Today'];

  const orders = [
    {
      id: 1,
      orderNumber: '63D00001',
      amount: 'Rp7.500.000',
      buyer: '24 November 2024\nShopee',
      porto: 'Porto Customer\n#32464001',
      tringgal: 'Tanggal Cair\n16 Nov 2024',
      ekspedisi: 'JNE Regular\nJAKARTA',
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
        <TouchableOpacity>
          <Icon name="refresh-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Barang Sudah Cair</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterDropdown}>
            <Text style={styles.filterText}>{selectedFilter}</Text>
            <Icon name="chevron-down" size={16} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyerDropdown}>
            <Text style={styles.filterText}>Buyer</Text>
            <Icon name="chevron-down" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Badge */}
      <View style={styles.summaryBadge}>
        <Text style={styles.summaryAmount}>Rp7.500.000</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Details Card */}
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Nomor Order</Text>
              <Text style={styles.orderLabel}>Tanggal & Platform</Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.orderValue}>{order.orderNumber}</Text>
              <Text style={styles.orderValueRight}>{order.buyer}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Rincian Customer</Text>
              <Text style={styles.orderLabel}>Ekspedisi</Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.orderValue}>{order.porto}</Text>
              <Text style={styles.orderValueRight}>{order.ekspedisi}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>{order.tringgal.split('\n')[0]}</Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.orderValue}>{order.tringgal.split('\n')[1]}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total Cair</Text>
              <Text style={styles.orderLabel}>Status</Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.orderValue}>{order.amount}</Text>
              <View style={[styles.statusBadge, { backgroundColor: COLORS.success + '20' }]}>
                <Text style={[styles.statusText, { color: COLORS.success }]}>Sudah Cair</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Detail</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Konfirmasi</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        ))}

        {/* Order Runanu Section */}
        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Nomor Order</Text>
            <Text style={styles.orderLabel}>Tanggal & Platform</Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderValue}>63D00002</Text>
            <Text style={styles.orderValueRight}>{`23 November 2024\nTokopedia`}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>{`Rincian Customer\n#30001234`}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Total Cair</Text>
            <Text style={styles.orderLabel}>Status</Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderValue}>Rp4.200.000</Text>
            <View style={[styles.statusBadge, { backgroundColor: COLORS.success + '20' }]}>
              <Text style={[styles.statusText, { color: COLORS.success }]}>Sudah Cair</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Detail</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnText}>Konfirmasi</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
    
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
    gap: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },

  // Title Section
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
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
  buyerDropdown: {
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

  // Summary Badge
  summaryBadge: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.success,
  },

  // Order Card
  orderCard: {
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
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderValueRight: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  spacer: {
    flex: 1,
  },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
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