/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
} from '@viro-community/react-viro';

const HelloARScene: React.FC = () => {
  return (
    <ViroARScene>
      <ViroText text="Hello AR" position={[0, 0, -1]} scale={[0.5, 0.5, 0.5]} />
    </ViroARScene>
  );
};

const App: React.FC = () => {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [cameraGranted, setCameraGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const anyNav: any = ViroARSceneNavigator as any;
        if (anyNav && typeof anyNav.isARSupportedOnDevice === 'function') {
          const ok = await anyNav.isARSupportedOnDevice();
          setSupported(!!ok);
        } else {
          setSupported(true);
        }
      } catch (e) {
        setSupported(false);
      }
    };
    check();
  }, []);

  useEffect(() => {
    const askPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const res = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Izin Kamera',
              message: 'Aplikasi memerlukan akses kamera untuk AR.',
              buttonPositive: 'OK',
              buttonNegative: 'Batal',
            },
          );
          setCameraGranted(res === PermissionsAndroid.RESULTS.GRANTED);
        } catch (e) {
          setCameraGranted(false);
        }
      } else {
        setCameraGranted(true);
      }
    };
    askPermission();
  }, []);

  if (supported === null || cameraGranted === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Menyiapkan AR & izin kamera...</Text>
      </View>
    );
  }

  if (!supported) {
    return (
      <View style={styles.center}>
        <Text>
          Perangkat ini tidak mendukung ARCore atau layanan AR belum terpasang.
        </Text>
      </View>
    );
  }

  if (!cameraGranted) {
    return (
      <View style={styles.center}>
        <Text>Izin kamera ditolak. Aktifkan untuk menggunakan AR.</Text>
      </View>
    );
  }

  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{scene: HelloARScene}}
      style={{flex: 1}}
    />
  );
};

const styles = StyleSheet.create({
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});

export default App;
