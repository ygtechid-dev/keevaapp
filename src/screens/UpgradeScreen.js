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
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  background: '#F5F7FA',
  white: '#FFFFFF',
  border: '#E5E5E5',
  divider: '#F0F0F0',
};

export default function UpgradeScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const plans = [
    {
      id: 'monthly',
      name: 'PRO Monthly',
      price: 'Rp 99.000',
      period: '/bulan',
      discount: null,
      color: COLORS.primary,
    },
    {
      id: 'yearly',
      name: 'PRO Yearly',
      price: 'Rp 990.000',
      period: '/tahun',
      discount: 'Hemat 17%',
      color: COLORS.purple,
      popular: true,
    },
  ];

  const features = [
    { icon: 'flash', title: 'Auto Claim', description: 'Pengajuan klaim otomatis tanpa manual' },
    { icon: 'stats-chart', title: 'Advanced Analytics', description: 'Analisis mendalam untuk bisnis Anda' },
    { icon: 'document-text', title: 'Custom Reports', description: 'Buat laporan sesuai kebutuhan' },
    { icon: 'download', title: 'Bulk Export', description: 'Export data dalam jumlah besar' },
    { icon: 'headset', title: 'Priority Support', description: 'Dukungan prioritas 24/7' },
    { icon: 'shield-checkmark', title: 'Extended History', description: 'Akses riwayat hingga 2 tahun' },
  ];

  const handleSubscribe = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    Alert.alert(
      'Konfirmasi Berlangganan',
      `Anda akan berlangganan ${plan.name} dengan harga ${plan.price}${plan.period}. Lanjutkan ke pembayaran?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Lanjutkan',
          onPress: () => {
            // Navigate to payment screen
            // navigation.navigate('PaymentScreen', { plan: selectedPlan });
            Alert.alert('Info', 'Fitur pembayaran akan segera tersedia');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade ke PRO</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.proBadgeLarge}>
            <Icon name="star" size={32} color={COLORS.warning} />
          </View>
          <Text style={styles.heroTitle}>Unlock Premium Features</Text>
          <Text style={styles.heroSubtitle}>
            Tingkatkan efisiensi bisnis Anda dengan fitur-fitur eksklusif PRO
          </Text>
        </View>

        {/* Plan Selection */}
        <View style={styles.planSection}>
          <Text style={styles.sectionTitle}>Pilih Paket Berlangganan</Text>
          
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                { borderColor: plan.color }
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.7}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.popularBadgeText}>TERPOPULER</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.discount && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{plan.discount}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.radioButton}>
                  {selectedPlan === plan.id && (
                    <View style={[styles.radioInner, { backgroundColor: plan.color }]} />
                  )}
                </View>
              </View>

              <View style={styles.planPricing}>
                <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>

              {plan.id === 'yearly' && (
                <Text style={styles.planEquivalent}>Setara Rp 82.500/bulan</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Fitur yang Anda Dapatkan</Text>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.purple + '15' }]}>
                <Icon name={feature.icon} size={24} color={COLORS.purple} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Icon name="checkmark-circle" size={24} color={COLORS.success} />
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitCard}>
            <Icon name="calendar-outline" size={24} color={COLORS.primary} />
            <Text style={styles.benefitText}>Bisa dibatalkan kapan saja</Text>
          </View>
          <View style={styles.benefitCard}>
            <Icon name="shield-checkmark-outline" size={24} color={COLORS.success} />
            <Text style={styles.benefitText}>Garansi uang kembali 30 hari</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          activeOpacity={0.8}
        >
          <Icon name="rocket" size={20} color={COLORS.white} />
          <Text style={styles.subscribeButtonText}>
            Berlangganan {plans.find(p => p.id === selectedPlan)?.price}
          </Text>
        </TouchableOpacity>
        <Text style={styles.bottomNote}>
          Dengan berlangganan, Anda menyetujui syarat dan ketentuan kami
        </Text>
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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.white,
    marginBottom: 20,
  },
  proBadgeLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Plan Section
  planSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 15,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
  },
  planCardSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  discountBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '800',
  },
  planPeriod: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  planEquivalent: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 5,
  },

  // Features Section
  featuresSection: {
    padding: 20,
    paddingTop: 0,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  // Benefits Section
  benefitsSection: {
    padding: 20,
    paddingTop: 0,
    gap: 10,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Bottom Bar
  bottomBar: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  subscribeButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.purple,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
    marginBottom: 10,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  bottomNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});