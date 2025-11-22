 import React from 'react';
 import { View, Text, StyleSheet } from 'react-native';

 export default function QRScanner() {
   return (
     <View style={styles.container}>
       <Text style={styles.title}>Scan (QR)</Text>
       <Text>QR scanner placeholder.</Text>
     </View>
   );
 }

 const styles = StyleSheet.create({
   container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
   title: { fontSize: 20, marginBottom: 8, fontWeight: '600' },
 });

