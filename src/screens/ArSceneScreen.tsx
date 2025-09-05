import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ViroARSceneNavigator} from '@viro-community/react-viro';
import ArScene from './ArScene';

const styles = StyleSheet.create({
  full: {flex: 1},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toggle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  active: {backgroundColor: 'rgba(0,150,0,0.7)'},
  toggleText: {color: 'white', fontWeight: '600'},
});

const ArSceneScreen: React.FC = () => {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [cameraGranted, setCameraGranted] = useState<boolean | null>(null);
  const [wallMode, setWallMode] = useState(false);

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
    <View style={styles.full}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{scene: ArScene as any}}
        viroAppProps={{wallMode}}
        style={styles.full}
      />
      <View style={styles.overlay}>
        <View style={[styles.toggle, wallMode ? styles.active : null]}>
          <Text
            onPress={() => setWallMode(w => !w)}
            style={styles.toggleText}
            accessibilityRole="button">
            {wallMode ? 'Wall Mode: ON' : 'Wall Mode: OFF'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ArSceneScreen;
