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

export default function LocationAccessScreen({ navigation }) {
  const handleAllowLocation = () => {
    // Request location permission here
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Akses Lokasi</Text>
        <Text style={styles.subtitle}>
          Izinkan akses lokasi agar penjemputan, pemesanan makanan dan lainnya lebih cepat dan akurat. Ini juga membantu kami menjaga keselamatan Anda. Kami berkomitmen penuh untuk melindungi dan menjaga privasi data lokasi Anda
        </Text>

        {/* Location Icon */}
        <View style={styles.iconContainer}>
          <Image 
            source={require('../assets/map-location.png')} 
            style={styles.mapImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Allow Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={handleAllowLocation}
        >
          <Text style={styles.btnText}>Izinkan Akses Lokasi</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
    paddingHorizontal: 28
  },
  title: {
    fontSize: 28,
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 15,
    lineHeight: 42
  },
  subtitle: {
    fontSize: 15,
    color: '#000000',
       fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 20,
    marginBottom: 40
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20
  },
  mapImage: {
    width: 150,
    height: 150
  },
  footer: {
    padding: 20,
    paddingBottom: 30
  },
  btn: { 
    backgroundColor: '#5DCBAD', 
    padding: 11, 
    height: 52,
    borderRadius: 12,
    shadowColor: '#4FD1C5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  btnText: { 
    color: 'white', 
    textAlign: 'center', 
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  }
});