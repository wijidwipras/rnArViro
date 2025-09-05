import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';

const HelpScreen = () => (
  <Layout style={styles.container}>
    <SafeAreaView style={styles.safe}>
      <Text category="h5" style={styles.title}>Bantuan</Text>
      <Text appearance="hint">Panduan singkat dan FAQ akan ditampilkan di sini.</Text>
    </SafeAreaView>
  </Layout>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', padding: 16},
  safe: {flex: 1},
  title: {marginBottom: 8},
});

export default HelpScreen;

