import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import IMGsrc from '../assets/keeva.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SplashScreen({ navigation }) {
useEffect(() => {
  const init = async () => {
    try {
      const tokenlaz = await AsyncStorage.getItem('lazada_token');

      console.log('==========================xx==========');

      if (tokenlaz) {
        const parsed = JSON.parse(tokenlaz);
        console.log('toklazz', parsed);

        // kalau ada token, masuk ke home
        navigation.replace("Home");
      } else {
        // kalau tidak ada token, ke login
        navigation.replace("Login");
      }

    } catch (error) {
      console.log("Error load token", error);
      navigation.replace("Login");
    }
  };

  // panggil fungsi
  init();

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
