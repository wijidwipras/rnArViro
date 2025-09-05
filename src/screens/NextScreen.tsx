import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

const NextScreen = () => {
  return (
    <Layout style={styles.container}>
      <Text category="h5">Ini screen selanjutnya</Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default NextScreen;

