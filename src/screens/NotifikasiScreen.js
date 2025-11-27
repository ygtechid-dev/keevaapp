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
  primary: '#2196F3',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FF9800',
  purple: '#667eea',
  
  dark: '#1A1A1A',
  darkCard: '#2C2C2E',
  darkBg: '#1C1C1E',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  textWhite: '#FFFFFF',
  
  background: '#F5F7FA',
  white: '#FFFFFF',
  
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

export default function NotifikasiScreen({ navigation }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'paket_hilang',
      title: 'Paket Berpotensi Hilang!',
      message: 'Order #2025-8899 (Shopee) tidak alnda update 3 hari-segera klaim!',
      time: '12m',
      read: false,
      icon: 'cloud-outline',
      iconBg: '#5E9FF2',
      actionText: null,
    },
    {
      id: 2,
      type: 'selisih_ongkir',
      title: 'Selisih Ongkir Ditemukan',
      message: 'Order #2025-7722 (TikTok: Rp 42.000 Bayer Rp 42.000',
      messageParts: [
        { text: 'Order #2025-7722 (TikTok: Rp 42.000 Bayer Rp 42.000  ', color: COLORS.textWhite },
        { text: 'Rugi:', color: COLORS.danger },
        { text: ' Rp 24.000', color: COLORS.textWhite }
      ],
      time: '25 min',
      read: false,
      icon: 'cube-outline',
      iconBg: '#FF8A5C',
      actionText: 'Ajukan Klaim',
      actionColor: COLORS.primary,
    },
    {
      id: 3,
      type: 'retur',
      title: 'Retur Belum Diterima',
      message: 'Order #2025-8871 (Shopee) sudah melemati SLA retur (H+3) Segera ajukan claim.',
      time: '36 min',
      read: false,
      icon: 'refresh-outline',
      iconBg: '#F5C542',
      actionText: 'Lihat Retur',
      actionColor: COLORS.primary,
    },
    {
      id: 4,
      type: 'klaim_approved',
      title: 'Klaim Disetujui',
      message: 'Klaim #CLM-001 telah disetujui. Kompensasi Rp 150.000 akan dicairkan dalam 3-5 hari kerja.',
      time: '2h',
      read: true,
      icon: 'checkmark-circle-outline',
      iconBg: COLORS.success,
      actionText: null,
    },
    {
      id: 5,
      type: 'info',
      title: 'Pembaruan Aplikasi',
      message: 'Versi 2.0 telah tersedia dengan fitur Auto Claim PRO!',
      time: '5h',
      read: true,
      icon: 'download-outline',
      iconBg: COLORS.purple,
      actionText: 'Update',
      actionColor: COLORS.purple,
    },
  ]);

  const handleNotificationPress = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? {...n, read: true} : n)
    );

    // Navigate based on type
    switch(notification.type) {
      case 'paket_hilang':
        navigation.navigate('FormKlaimScreen', { claimType: 'paket_hilang' });
        break;
      case 'selisih_ongkir':
        navigation.navigate('FormKlaimScreen', { claimType: 'selisih_ongkir' });
        break;
      case 'retur':
        navigation.navigate('MonitoringKlaimScreen');
        break;
      case 'klaim_approved':
        navigation.navigate('MonitoringKlaimScreen');
        break;
      default:
        break;
    }
  };

  const handleAction = (notification) => {
    if (notification.actionText === 'Ajukan Klaim') {
      navigation.navigate('FormKlaimScreen', { claimType: 'selisih_ongkir' });
    } else if (notification.actionText === 'Lihat Retur') {
      navigation.navigate('MonitoringKlaimScreen');
    } else if (notification.actionText === 'Update') {
      Alert.alert('Update', 'Mengarahkan ke App Store...');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
    Alert.alert('Berhasil', 'Semua notifikasi ditandai sudah dibaca');
  };

  const handleClearAll = () => {
    Alert.alert(
      'Hapus Semua Notifikasi',
      'Apakah Anda yakin ingin menghapus semua notifikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => setNotifications([])
        }
      ]
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Notifikasi</Text>
            {unreadCount > 0 && (
              <Text style={styles.headerSubtitle}>{unreadCount} belum dibaca</Text>
            )}
          </View>
        </View>
        <TouchableOpacity 
          style={styles.headerIconBtn}
          onPress={handleMarkAllRead}
        >
          <Icon name="checkmark-done-outline" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="notifications-off-outline" size={80} color={COLORS.textMuted} />
            <Text style={styles.emptyStateTitle}>Tidak Ada Notifikasi</Text>
            <Text style={styles.emptyStateText}>
              Semua notifikasi Anda akan muncul di sini
            </Text>
          </View>
        ) : (
          <>
            {/* Today Section */}
            {notifications.filter(n => !n.read).length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Terbaru</Text>
                </View>
                {notifications.filter(n => !n.read).map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleNotificationPress(notification)}
                    onActionPress={() => handleAction(notification)}
                  />
                ))}
              </>
            )}

            {/* Earlier Section */}
            {notifications.filter(n => n.read).length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Sebelumnya</Text>
                </View>
                {notifications.filter(n => n.read).map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleNotificationPress(notification)}
                    onActionPress={() => handleAction(notification)}
                  />
                ))}
              </>
            )}

            {/* Clear All Button */}
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={handleClearAll}
            >
              <Icon name="trash-outline" size={18} color={COLORS.danger} />
              <Text style={styles.clearAllText}>Hapus Semua Notifikasi</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// Notification Card Component
const NotificationCard = ({ notification, onPress, onActionPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.notificationCard,
        !notification.read && styles.notificationCardUnread
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        {/* Icon */}
        <View style={[styles.notificationIcon, { backgroundColor: notification.iconBg }]}>
          <Icon name={notification.icon} size={24} color={COLORS.white} />
        </View>

        {/* Content */}
        <View style={styles.notificationBody}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>

          {/* Message */}
          {notification.messageParts ? (
            <Text style={styles.notificationMessage}>
              {notification.messageParts.map((part, index) => (
                <Text key={index} style={{ color: part.color }}>
                  {part.text}
                </Text>
              ))}
            </Text>
          ) : (
            <Text style={styles.notificationMessage}>{notification.message}</Text>
          )}

          {/* Action Button */}
          {notification.actionText && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onActionPress}
            >
              <Text style={[styles.actionButtonText, { color: notification.actionColor }]}>
                {notification.actionText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Unread Indicator */}
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: COLORS.dark,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  headerIconBtn: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textWhite,
  },

  // Notification Card
  notificationCard: {
    backgroundColor: COLORS.darkCard,
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  notificationCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationContent: {
    flexDirection: 'row',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationBody: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textWhite,
    flex: 1,
    marginRight: 10,
  },
  notificationTime: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 8,
  },
  actionButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Clear All Button
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.darkCard,
    marginHorizontal: 15,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
    gap: 8,
  },
  clearAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.danger,
  },
});