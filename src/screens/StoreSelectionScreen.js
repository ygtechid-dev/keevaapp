import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function StoreSelectionScreen({ navigation }) {
  const stores = [
    {
      id: 1,
      name: 'Shopee',
      icon: require('../assets/shopee.png'), // Ganti dengan path gambar Anda
      color: '#EE4D2D',
      description: 'Kelola toko Shopee Seller kamu'
    },
    {
      id: 2,
      name: 'TikTok Shop',
      icon: require('../assets/tiktok.jpg'), // Ganti dengan path gambar Anda
      color: '#000000',
      description: 'Kelola toko TikTok Shop kamu'
    },
    {
      id: 3,
      name: 'Tokopedia',
      icon: require('../assets/tokopedia.png'), // Ganti dengan path gambar Anda
      color: '#42B549',
      description: 'Kelola toko Tokopedia Seller kamu'
    }
  ];

  const handleStoreSelect = (storeName) => {
    // Navigasi ke halaman login seller untuk marketplace yang dipilih
    navigation.navigate("SellerLoginScreen", { marketplace: storeName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pilih Toko</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Hubungkan Toko Kamu</Text>
          <Text style={styles.subtitle}>Pilih marketplace dan login dengan akun seller kamu</Text>
        </View>

        {/* Store Cards */}
        <View style={styles.storeList}>
          {stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={[styles.storeCard, { borderColor: store.color }]}
              onPress={() => handleStoreSelect(store.name)}
              activeOpacity={0.7}
            >
              <View style={styles.storeCardContent}>
                <View style={[styles.iconContainer, { backgroundColor: store.color + '15' }]}>
                  <Image 
                    source={store.icon} 
                    style={styles.storeIcon}
                    resizeMode="contain"
                  />
                </View>
                
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeDescription}>{store.description}</Text>
                </View>
                
                <Icon name="chevron-forward" size={24} color="#999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <Icon name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Kamu bisa menghubungkan beberapa akun seller sekaligus
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backBtn: {
    padding: 5
  },
  headerTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    marginBottom: 30,
    marginTop: 10
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: '#666'
  },
  storeList: {
    gap: 15
  },
  storeCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 15
  },
  storeCardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  storeIcon: {
    width: 40,
    height: 40
  },
  storeInfo: {
    flex: 1
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4
  },
  storeDescription: {
    fontSize: 13,
    color: '#666'
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    gap: 8
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center'
  }
});