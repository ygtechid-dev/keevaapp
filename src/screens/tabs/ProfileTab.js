import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  
  background: '#F5F7FA',
  white: '#FFFFFF',
  
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

export default function ProfileTab({ navigation }) {
  const [isPro, setIsPro] = useState(false); // Set true untuk testing PRO
  const [lazToken, setLazToken] = useState({})

const getTok = async () => {
  const tokenlaz = await AsyncStorage.getItem('lazada_token')
  console.log('==========================xx==========');

  if(tokenlaz) { 
    const jparse = JSON.parse(tokenlaz)
  console.log('toklazz', tokenlaz);
  console.log('====================================');
  setLazToken(jparse)

  }
}

useEffect(() => {
  getTok()
}, [])


  const handleLogout = () => {
    alert('woy')
  };

  const handleUpgradeToPro = () => {
    navigation.navigate('UpgradeScreen');
  };

  const menuSections = [
    {
      title: 'Integrasi',
      items: [
        {
          id: 'shopee',
          iconImage: 'https://logodix.com/logo/2015036.png',
          iconBg: '#EE4D2D15',
          label: 'Shopee',
          action: 'Hubungkan',
          actionColor: COLORS.primary,
          onPress: () => Alert.alert('Shopee', 'Hubungkan akun Shopee Anda')
        },
        {
          id: 'tiktok',
          iconImage: 'https://toffeedev.com/wp-content/uploads/2023/12/tiktok-shop-tokopedia.png',
          iconBg: '#00000015',
          label: 'TikTok Shop',
          action: 'Hubungkan',
          actionColor: COLORS.primary,
          onPress: () => Alert.alert('TikTok', 'Hubungkan akun TikTok Shop Anda')
        },
        {
          id: 'tokopedia',
          iconImage: 'https://iconlogovector.com/uploads/images/2025/01/sm-678e4c7b953e1-Tokopedia.webp',
          iconBg: '#42B54915',
          label: 'Tokopedia',
          action: 'Hubungkan',
          actionColor: COLORS.primary,
          onPress: () => Alert.alert('Tokopedia', 'Hubungkan akun Tokopedia Anda')
        },
        {
          id: 'lazada',
          iconImage: 'https://static.vecteezy.com/system/resources/previews/054/650/831/non_2x/lazada-logo-rounded-lazada-logo-free-png.png',
          iconBg: '#0F146D15',
          label: 'Lazada',
          action: lazToken.access_token ? 'Terhubung' : 'Hubungkan',
          actionColor: COLORS.primary,
           onPress: () => navigation.navigate('LazadaOauthScreen')
        },
        {
          id: 'sla',
          icon: 'time-outline',
          iconBg: COLORS.warning + '15',
          iconColor: COLORS.warning,
          label: 'Atur SLA & Notifikasi',
          onPress: () => navigation.navigate('SLANotifikasiScreen')
        },
        {
          id: 'kelola',
          icon: 'people-outline',
          iconBg: COLORS.primary + '15',
          iconColor: COLORS.primary,
          label: 'Kelola Pengguna',
          onPress: () => navigation.navigate('KelolaPenggunaScreen')
        },
      ]
    },
    {
      title: 'Profil & Keamanan',
      items: [
        {
          id: 'edit-profil',
          icon: 'person-outline',
          iconBg: COLORS.success + '15',
          iconColor: COLORS.success,
          label: 'Edit Profil',
          onPress: () => navigation.navigate('EditProfilScreen')
        },
        {
          id: 'ganti-password',
          icon: 'lock-closed-outline',
          iconBg: COLORS.danger + '15',
          iconColor: COLORS.danger,
          label: 'Ganti Password',
          onPress: () => navigation.navigate('GantiPasswordScreen')
        },
        {
          id: 'keamanan',
          icon: 'shield-checkmark-outline',
          iconBg: COLORS.purple + '15',
          iconColor: COLORS.purple,
          label: 'Keamanan Akun',
          onPress: () => navigation.navigate('KeamananAkunScreen')
        },
      ]
    },
    {
      title: 'Bantuan & Lainnya',
      items: [
        {
          id: 'bantuan',
          icon: 'help-circle-outline',
          iconBg: COLORS.primary + '15',
          iconColor: COLORS.primary,
          label: 'Pusat Bantuan',
          onPress: () => navigation.navigate('PusatBantuanScreen')
        },
        {
          id: 'tentang',
          icon: 'information-circle-outline',
          iconBg: COLORS.textMuted + '15',
          iconColor: COLORS.textMuted,
          label: 'Tentang Aplikasi',
          onPress: () => navigation.navigate('TentangAplikasiScreen')
        },
        {
          id: 'syarat',
          icon: 'document-text-outline',
          iconBg: COLORS.textMuted + '15',
          iconColor: COLORS.textMuted,
          label: 'Syarat & Ketentuan',
          onPress: () => navigation.navigate('SyaratKetentuanScreen')
        },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Akun Saya</Text>
        <TouchableOpacity 
          style={styles.headerIconBtn}
          onPress={() => navigation.navigate('NotifikasiScreen')}
        >
          <View style={styles.notificationBadge} />
          <Icon name="notifications-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                  style={styles.avatar}
                />
                {isPro && (
                  <View style={styles.proBadge}>
                    <Icon name="star" size={12} color={COLORS.white} />
                  </View>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Yogi Permana</Text>
                <Text style={styles.profileEmail}>yogi@example.com</Text>
                {isPro && (
                  <View style={styles.proStatusBadge}>
                    <Icon name="flash" size={12} color={COLORS.warning} />
                    <Text style={styles.proStatusText}>PRO Member</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => navigation.navigate('EditProfilScreen')}
            >
              <Icon name="create-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Pesanan</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Klaim Aktif</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Toko</Text>
            </View>
          </View>
        </View>

        {/* PRO Banner - Only if not PRO */}
        {!isPro && (
          <TouchableOpacity 
            style={styles.proBanner}
            onPress={handleUpgradeToPro}
            activeOpacity={0.9}
          >
            <View style={styles.proBannerContent}>
              <View style={styles.proBannerLeft}>
                <View style={styles.proBannerIcon}>
                  <Icon name="flash" size={32} color={COLORS.warning} />
                </View>
                <View style={styles.proBannerText}>
                  <Text style={styles.proBannerTitle}>Upgrade ke PRO</Text>
                  <Text style={styles.proBannerSubtitle}>
                    Dapatkan Auto Claim & fitur eksklusif lainnya
                  </Text>
                </View>
              </View>
              <Icon name="chevron-forward" size={24} color={COLORS.white} />
            </View>
            <View style={styles.proBannerDecor1} />
            <View style={styles.proBannerDecor2} />
          </TouchableOpacity>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.menuItemLast
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    {/* Icon - Image or Icon */}
                    {item.iconImage ? (
                      <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
                        <Image 
                          source={{ uri: item.iconImage }} 
                          style={styles.menuIconImage}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
                        <Icon name={item.icon} size={22} color={item.iconColor} />
                      </View>
                    )}
                    
                    {/* Label */}
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>

                  {/* Right Action */}
                  {item.action ? (
                    <Text style={[styles.menuAction, { color: item.actionColor }]}>
                      {item.action}
                    </Text>
                  ) : (
                    <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            alert('weyyy')
          }}
          activeOpacity={0.8}
        >
          <Icon name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.appVersion}>Versi 1.0.0</Text>

        <View style={{ height: 30 }} />
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
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerIconBtn: {
    padding: 4,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 1,
  },
  scrollContent: {
    flex: 1,
  },

  // Profile Card
  profileCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.border,
  },
  proBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
  },
  proStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  proStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warning,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.divider,
  },

  // PRO Banner
  proBanner: {
    position: 'relative',
    backgroundColor: COLORS.purple,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  proBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
  },
  proBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 15,
  },
  proBannerIcon: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  proBannerText: {
    flex: 1,
  },
  proBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  proBannerSubtitle: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.95,
  },
  proBannerDecor1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  proBannerDecor2: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  // Menu Section
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconImage: {
    width: 28,
    height: 28,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  menuAction: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger + '30',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.danger,
  },

  // App Version
  appVersion: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});