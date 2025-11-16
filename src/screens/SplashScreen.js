import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import IMGsrc from '../assets/keeva.png';
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={IMGsrc} style={{width: 218, height: 205, alignSelf: 'center'}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', justifyContent: 'center'},
  logo: { fontSize: 34, fontWeight: 'bold', marginBottom: 20, color: '#FF5F00' }
});
