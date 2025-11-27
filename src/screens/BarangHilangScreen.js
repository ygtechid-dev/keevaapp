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
  info: '#2196F3',
  dark: '#1A1A1A',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  background: '#F5F7FA',
  white: '#FFFFFF',
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

export function BarangHilangScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laporan</Text>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Barang Hilang</Text>
        <View style={styles.badgeRow}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>Total 3 Paket Hilang</Text>
            <Icon name="information-circle-outline" size={16} color={COLORS.textMuted} />
          </View>
        </View>
      </View>

      {/* Summary Badge */}
      <View style={styles.summaryBadge}>
        <Text style={styles.summaryAmount}>Rp300.000</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Cards */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderLabel}>Informasi Klaim</Text>
              <View style={styles.statusRow}>
                <Text style={styles.orderNumber}>Order #ORD001</Text>
                <View style={[styles.statusBadge, { backgroundColor: COLORS.danger + '20' }]}>
                  <Text style={[styles.statusText, { color: COLORS.danger }]}>Hilang</Text>
                </View>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderInfo}>Nomor Order</Text>
            <Text style={styles.orderInfo}>Status</Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderValue}>#ORD001234</Text>
            <Text style={styles.orderValue}>Belum Klaim</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderRow}>
            <Text style={styles.orderInfo}>Nilai Kerugian</Text>
            <Text style={styles.orderInfo}>Estimasi Klaim</Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderValue}>Rp150.000</Text>
            <Text style={styles.orderValue}>Rp135.000</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.klaimBtn} 
            onPress={() => navigation.navigate('FormKlaimScreen', { claimType: 'Barang Hilang' })}
          >
            <Text style={styles.klaimBtnText}>Ajukan Klaim</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

export function SelisihOngkirScreen({ navigation }) {
  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-62300001',
      date: '15 Nov 2024, 14:30',
      buyer: 'Budi Santoso',
      estimasiOngkir: 15000,
      ongkirAktual: 12000,
      totalOrder: 142000,
      ekspedisi: 'JNE REG',
      status: 'pending',
    },
    {
      id: 2,
      orderNumber: 'ORD-63000001',
      date: '14 Nov 2024, 10:15',
      buyer: 'Siti Aminah',
      estimasiOngkir: 18000,
      ongkirAktual: 14000,
      totalOrder: 140000,
      ekspedisi: 'SiCepat',
      status: 'pending',
    },
  ];

  const totalSelisih = orders.reduce((sum, order) => 
    sum + (order.estimasiOngkir - order.ongkirAktual), 0
  );

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

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Selisih Ongkir</Text>
        <Text style={styles.pageSubtitle}>Total {orders.length} pesanan dengan selisih</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryIconContainer}>
          <Icon name="wallet-outline" size={32} color={COLORS.warning} />
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>Total Selisih Ongkir</Text>
          <Text style={styles.summaryValue}>Rp{totalSelisih.toLocaleString('id-ID')}</Text>
          <Text style={styles.summaryDesc}>
            Dana yang bisa diklaim kembali
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Cards */}
        {orders.map((order) => {
          const selisih = order.estimasiOngkir - order.ongkirAktual;
          
          return (
            <View key={order.id} style={styles.ongkirCard}>
              {/* Card Header */}
              <View style={styles.ongkirCardHeader}>
                <View style={styles.ongkirHeaderLeft}>
                  <Icon name="receipt-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.ongkirOrderNumber}>{order.orderNumber}</Text>
                </View>
                <View style={[styles.ongkirStatusBadge, { backgroundColor: COLORS.warning + '15' }]}>
                  <Icon name="time-outline" size={12} color={COLORS.warning} />
                  <Text style={[styles.ongkirStatusText, { color: COLORS.warning }]}>
                    Pending Klaim
                  </Text>
                </View>
              </View>

              {/* Date & Buyer */}
              <View style={styles.ongkirMeta}>
                <View style={styles.ongkirMetaItem}>
                  <Icon name="calendar-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.ongkirMetaText}>{order.date}</Text>
                </View>
                <View style={styles.ongkirMetaItem}>
                  <Icon name="person-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.ongkirMetaText}>{order.buyer}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Ongkir Details */}
              <View style={styles.ongkirDetailsContainer}>
                {/* Estimasi */}
                <View style={styles.ongkirDetailItem}>
                  <View style={styles.ongkirDetailHeader}>
                    <Icon name="calculator-outline" size={16} color={COLORS.info} />
                    <Text style={styles.ongkirDetailLabel}>Estimasi Ongkir</Text>
                  </View>
                  <Text style={styles.ongkirDetailValue}>
                    Rp{order.estimasiOngkir.toLocaleString('id-ID')}
                  </Text>
                </View>

                {/* Aktual */}
                <View style={styles.ongkirDetailItem}>
                  <View style={styles.ongkirDetailHeader}>
                    <Icon name="checkmark-circle-outline" size={16} color={COLORS.success} />
                    <Text style={styles.ongkirDetailLabel}>Ongkir Aktual</Text>
                  </View>
                  <Text style={styles.ongkirDetailValue}>
                    Rp{order.ongkirAktual.toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>

              {/* Selisih Highlight */}
              <View style={styles.selisihHighlight}>
                <View style={styles.selisihHighlightLeft}>
                  <Icon name="trending-down" size={20} color={COLORS.warning} />
                  <View>
                    <Text style={styles.selisihHighlightLabel}>Selisih</Text>
                    <Text style={styles.selisihHighlightValue}>
                      Rp{selisih.toLocaleString('id-ID')}
                    </Text>
                  </View>
                </View>
                <View style={styles.ekspedisiBadge}>
                  <Icon name="car-outline" size={14} color={COLORS.textLight} />
                  <Text style={styles.ekspedisiText}>{order.ekspedisi}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Total Order */}
              <View style={styles.ongkirFooter}>
                <Text style={styles.ongkirTotalLabel}>Total Pesanan</Text>
                <Text style={styles.ongkirTotalValue}>
                  Rp{order.totalOrder.toLocaleString('id-ID')}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.ongkirActions}>
                <TouchableOpacity style={styles.ongkirBtnOutline}>
                  <Icon name="eye-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.ongkirBtnOutlineText}>Detail</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.ongkirBtnPrimary}
                  onPress={() => navigation.navigate('FormKlaimScreen', { 
                    claimType: 'Selisih Ongkir',
                    orderNumber: order.orderNumber,
                    amount: selisih 
                  })}
                >
                  <Icon name="document-text-outline" size={16} color={COLORS.white} />
                  <Text style={styles.ongkirBtnPrimaryText}>Ajukan Klaim</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="cube-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="sync-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Laporan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Akun</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="grid-outline" size={24} color={COLORS.primary} />
          <Text style={[styles.navLabel, { color: COLORS.primary }]}>Lainnya</Text>
        </TouchableOpacity>
      </View> */}
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
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  infoBadgeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Summary Badge (Barang Hilang)
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
    color: COLORS.danger,
  },

  // Summary Card (Selisih Ongkir)
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  summaryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.warning,
    marginBottom: 4,
  },
  summaryDesc: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  // Order Card (Barang Hilang)
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderInfo: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  orderValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  klaimBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  klaimBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Ongkir Card (NEW DESIGN)
  ongkirCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  ongkirCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ongkirHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ongkirOrderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  ongkirStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ongkirStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  ongkirMeta: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 12,
  },
  ongkirMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ongkirMetaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  
  // Ongkir Details Container
  ongkirDetailsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  ongkirDetailItem: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
  },
  ongkirDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ongkirDetailLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  ongkirDetailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Selisih Highlight
  selisihHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '10',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  selisihHighlightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selisihHighlightLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  selisihHighlightValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.warning,
  },
  ekspedisiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ekspedisiText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
  },

  // Ongkir Footer
  ongkirFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ongkirTotalLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  ongkirTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Ongkir Actions
  ongkirActions: {
    flexDirection: 'row',
    gap: 10,
  },
  ongkirBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 8,
  },
  ongkirBtnOutlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  ongkirBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 8,
  },
  ongkirBtnPrimaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
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