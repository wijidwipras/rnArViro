import React from 'react';
import {StyleSheet, View, StatusBar, Image} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import ShadowButton from '../components/common/ShadowButton';

const APP_VERSION = require('../../package.json').version;

const SplashScreen = ({navigation}: any) => {
  return (
    <Layout style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View pointerEvents="none" style={styles.blobs}>
        <Image
          source={require('../assets/images/kananatas.png')}
          style={styles.blobTopRight}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/kiritengah.png')}
          style={styles.blobMidLeft}
          resizeMode="contain"
        />
      </View>
      <View style={styles.centerArea}>
        <View style={styles.welcome}>
          <LottieView
            style={styles.lottie}
            source={require('../assets/images/cube2.json')}
            autoPlay
            loop
          />
        </View>
        <Image
          source={require('../assets/images/logo-criti-space.png')}
          style={styles.logo}
        />
        <Text appearance="hint" style={styles.tagline}>
          Explore Geometry. Think Critically. Visualize in 3D
        </Text>
        <View style={styles.versionContainer}>
          <Text appearance="hint" style={styles.version}>
            v {APP_VERSION}
          </Text>
        </View>
      </View>
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.bottomArea}>
          <ShadowButton
            size="large"
            containerStyle={styles.ctaButton}
            onPress={() => navigation.navigate('Login')}>
            Mulai
          </ShadowButton>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  logo: {height: 50, aspectRatio: 3.5},
  versionContainer: {alignSelf: 'center', marginTop: 8},
  blobs: {...StyleSheet.absoluteFillObject},
  blobTopRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 220,
    height: 220,
    opacity: 0.9,
  },
  blobMidLeft: {
    position: 'absolute',
    top: '40%',
    left: -60,
    width: 260,
    height: 260,
    opacity: 0.7,
  },
  centerArea: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  bottomArea: {paddingHorizontal: 24, paddingBottom: 12},
  version: {alignSelf: 'center', marginTop: 100},
  tagline: {marginTop: 6, textAlign: 'center'},
  ctaButton: {width: '100%', borderRadius: 15, marginBottom: 40},
  welcome: {width: '70%', maxWidth: 360, aspectRatio: 1, overflow: 'visible'},
  lottie: {width: '100%', height: '100%'},
});

export default SplashScreen;

