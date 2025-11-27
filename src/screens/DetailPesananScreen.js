import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Color Palette
const COLORS = {
  primary: '#EE4D2D',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  background: '#F5F5F5',
  white: '#FFFFFF',
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

export default function DetailPesananScreen({ route, navigation }) {
  const { order } = route.params;

  const timeline = [
    { 
      id: 1, 
      status: 'Pesanan Dibuat', 
      date: '16 Nov 2024, 14:30', 
      description: 'Pesanan telah dibuat oleh pembeli',
      icon: 'cart',
      completed: true,
    },
    { 
      id: 2, 
      status: 'Pembayaran Dikonfirmasi', 
      date: '16 Nov 2024, 14:35', 
      description: 'Pembayaran berhasil dikonfirmasi',
      icon: 'checkmark-circle',
      completed: order.status !== 'unpaid',
    },
    { 
      id: 3, 
      status: 'Pesanan Diproses', 
      date: '16 Nov 2024, 15:00', 
      description: 'Pesanan sedang dikemas',
      icon: 'cube',
      completed: ['toship', 'shipping', 'completed'].includes(order.status),
    },
    { 
      id: 4, 
      status: 'Pesanan Dikirim', 
      date: order.status === 'shipping' || order.status === 'completed' ? '16 Nov 2024, 18:00' : '-', 
      description: order.trackingNumber !== '-' ? `No. Resi: ${order.trackingNumber}` : 'Menunggu pengiriman',
      icon: 'rocket',
      completed: ['shipping', 'completed'].includes(order.status),
    },
    { 
      id: 5, 
      status: 'Pesanan Selesai', 
      date: order.status === 'completed' ? '18 Nov 2024, 10:30' : '-', 
      description: order.status === 'completed' ? 'Pesanan telah diterima pembeli' : 'Menunggu konfirmasi penerimaan',
      icon: 'checkmark-done-circle',
      completed: order.status === 'completed',
    },
  ];

  const handlePrintLabel = () => {
    Alert.alert('Cetak Label', 'Fitur cetak label pengiriman');
  };

  const handleArrangeShipping = () => {
    Alert.alert('Atur Pengiriman', 'Fitur atur pengiriman');
  };

  const handleTrackPackage = () => {
    Alert.alert('Lacak Paket', `Melacak paket dengan resi: ${order.trackingNumber}`);
  };

  const handleChatCustomer = () => {
    Alert.alert('Chat', `Menghubungi ${order.customer}`);
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Batalkan Pesanan',
      'Apakah Anda yakin ingin membatalkan pesanan ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya, Batalkan', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
        <TouchableOpacity onPress={handleChatCustomer}>
          <Icon name="chatbubble-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon 
              name={order.status === 'completed' ? 'checkmark-circle' : 
                    order.status === 'cancelled' ? 'close-circle' : 
                    order.status === 'shipping' ? 'rocket' : 'time'}
              size={32} 
              color={
                order.status === 'completed' ? COLORS.success :
                order.status === 'cancelled' ? COLORS.danger :
                order.status === 'shipping' ? COLORS.primary :
                COLORS.warning
              } 
            />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>{order.statusLabel}</Text>
              <Text style={styles.statusDesc}>
                {order.status === 'unpaid' && 'Menunggu pembayaran dari pembeli'}
                {order.status === 'toship' && 'Segera kirim pesanan ini'}
                {order.status === 'shipping' && 'Paket sedang dalam perjalanan'}
                {order.status === 'completed' && 'Pesanan telah selesai'}
                {order.status === 'cancelled' && order.note}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pesanan</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>No. Pesanan</Text>
            <Text style={styles.infoValue}>{order.orderNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tanggal</Text>
            <Text style={styles.infoValue}>{order.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pembayaran</Text>
            <Text style={styles.infoValue}>{order.paymentMethod}</Text>
          </View>
          {order.shippingMethod !== '-' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pengiriman</Text>
              <Text style={styles.infoValue}>{order.shippingMethod}</Text>
            </View>
          )}
          {order.trackingNumber !== '-' && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>No. Resi</Text>
              <TouchableOpacity onPress={handleTrackPackage}>
                <Text style={[styles.infoValue, { color: COLORS.primary }]}>
                  {order.trackingNumber}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pembeli</Text>
          <View style={styles.customerCard}>
            <View style={styles.customerAvatar}>
              <Icon name="person" size={24} color={COLORS.white} />
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.customer}</Text>
              {/* <TouchableOpacity onPress={handleChatCustomer}>
                <Text style={styles.chatLink}>Chat Pembeli</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produk Dipesan</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Icon name="image-outline" size={32} color={COLORS.textMuted} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQty}>x{item.qty}</Text>
              </View>
              <Text style={styles.productPrice}>
                Rp{item.price.toLocaleString('id-ID')}
              </Text>
            </View>
          ))}
        </View>

        {/* Price Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Subtotal Produk ({order.items.reduce((sum, item) => sum + item.qty, 0)} barang)
            </Text>
            <Text style={styles.priceValue}>
              Rp{order.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Ongkos Kirim</Text>
            <Text style={styles.priceValue}>Rp0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>
              Rp{order.totalAmount.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* Timeline */}
        {order.status !== 'cancelled' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Riwayat Pesanan</Text>
            {timeline.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineIcon,
                    { 
                      backgroundColor: item.completed ? COLORS.primary + '20' : COLORS.background,
                      borderColor: item.completed ? COLORS.primary : COLORS.border,
                    }
                  ]}>
                    <Icon 
                      name={item.icon} 
                      size={16} 
                      color={item.completed ? COLORS.primary : COLORS.textMuted} 
                    />
                  </View>
                  {index < timeline.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      { backgroundColor: item.completed ? COLORS.primary : COLORS.border }
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[
                    styles.timelineStatus,
                    { color: item.completed ? COLORS.text : COLORS.textMuted }
                  ]}>
                    {item.status}
                  </Text>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                  <Text style={styles.timelineDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Note */}
        {order.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catatan</Text>
            <View style={styles.noteCard}>
              <Icon name="document-text-outline" size={20} color={COLORS.textLight} />
              <Text style={styles.noteText}>{order.note}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        {order.status === 'toship' && (
          <>
            <TouchableOpacity 
              style={styles.bottomBtnSecondary}
              onPress={handlePrintLabel}
            >
              <Icon name="print-outline" size={18} color={COLORS.text} />
              <Text style={styles.bottomBtnSecondaryText}>Cetak Label</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.bottomBtnPrimary}
              onPress={handleArrangeShipping}
            >
              <Text style={styles.bottomBtnPrimaryText}>Atur Pengiriman</Text>
            </TouchableOpacity>
          </>
        )}
        {order.status === 'shipping' && (
          <TouchableOpacity 
            style={[styles.bottomBtnPrimary, { flex: 1 }]}
            onPress={handleTrackPackage}
          >
            <Icon name="location-outline" size={18} color={COLORS.white} />
            <Text style={styles.bottomBtnPrimaryText}>Lacak Paket</Text>
          </TouchableOpacity>
        )}
        {order.status === 'unpaid' && (
          <>
            <TouchableOpacity 
              style={styles.bottomBtnSecondary}
              onPress={handleCancelOrder}
            >
              <Text style={styles.bottomBtnSecondaryText}>Batalkan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBtnPrimary}>
              <Text style={styles.bottomBtnPrimaryText}>Ingatkan Pembeli</Text>
            </TouchableOpacity>
          </>
        )}
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginLeft: 15,
  },

  // Status Card
  statusCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginVertical: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statusDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  // Section
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },

  // Customer Card
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  chatLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Product Card
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
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
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Price Details
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Timeline
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },

  // Note Card
  noteCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  bottomBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  bottomBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  bottomBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});