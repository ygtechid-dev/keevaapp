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



export function SelisihOngkirScreen({ navigation }) {
  const orders = [
    {
      id: 1,
      orderNumber: '62300001',
      buyer: 'Buyer\nvitxun',
      burnu: 'Burnu Detuaseng\nRolice Ehfiem',
      amount: 'Rp142.000',
      pelvcroaa: 'Pelvcroaa\nRp144:00',
    },
    {
      id: 2,
      orderNumber: '63i000001',
      buyer: 'Randi Dem',
      bayat: 'Bayat Roking\n21 Yob Alerau',
      amount: 'Rp140.000',
      riure: 'Riure Ningan\n63:092301',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleller Cloud</Text>
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
        <View style={styles.amountRow}>
          <Text style={styles.totalAmount}>Rp 142.000</Text>
          <Icon name="chevron-down" size={16} color={COLORS.textMuted} />
          <Text style={styles.detailAmount}>Rp 140.000</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Cards */}
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order Numer</Text>
              <Text style={styles.orderLabel}>Buyer</Text>
            </View>

            <View style={styles.orderRow}>
              <Text style={styles.orderValue}>{order.orderNumber}</Text>
              <Text style={styles.orderValue}>{order.buyer}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderRow}>
              <Text style={styles.orderInfo}>{order.id === 1 ? order.burnu : order.bayat}</Text>
              <Text style={styles.orderInfo}>{order.id === 1 ? order.pelvcroaa : order.riure}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Detal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Ajukan Klaim</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="cube-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Essyuxtl</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="sync-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Akach</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Essunun</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="grid-outline" size={24} color={COLORS.primary} />
          <Text style={[styles.navLabel, { color: COLORS.primary }]}>Anpaim</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 50,
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
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  detailAmount: {
    fontSize: 13,
    color: COLORS.danger,
    fontWeight: '600',
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
    color: COLORS.danger,
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

  // Klaim Section
  klaimSection: {
    paddingHorizontal: 15,
  },
  klaimSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  klaimCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  klaimRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  klaimLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  klaimValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
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
