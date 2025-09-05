import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ViroARSceneNavigator} from '@viro-community/react-viro';
import ArScene from './ArScene';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';

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
  headerOverlay: {
    position: 'absolute',
    top: 20,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {color: 'white', fontWeight: '600'},
  scaleControls: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  scaleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleBtnText: {color: 'white', fontSize: 18, fontWeight: '600'},
  scaleInput: {
    marginHorizontal: 10,
    minWidth: 64,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.6)',
  },
});

const ArSceneScreen: React.FC = () => {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [cameraGranted, setCameraGranted] = useState<boolean | null>(null);
  const [scale, setScale] = useState(0.4);
  const [scaleNonce, setScaleNonce] = useState(0);
  const navigation = useNavigation<any>();

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
        viroAppProps={{scale, scaleNonce}}
        style={styles.full}
      />
      {/* <View style={styles.headerOverlay} pointerEvents="box-none">
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon color="white" size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Media AR</Text>
      </View> */}
      <View style={styles.overlay}>
        <View style={styles.scaleControls}>
          <TouchableOpacity
            style={styles.scaleBtn}
            accessibilityRole="button"
            accessibilityLabel="Kurangi skala"
            onPress={() => {
              const next = Math.max(0.01, Math.round((scale - 0.1) * 10) / 10);
              setScale(next);
              setScaleNonce(n => n + 1);
            }}>
            <Text style={styles.scaleBtnText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.scaleInput}
            value={String(scale.toFixed(1))}
            onChangeText={txt => {
              const num = parseFloat(txt.replace(',', '.'));
              if (!Number.isNaN(num)) {
                let next = Math.round(num * 10) / 10;
                next = Math.max(0.01, next);
                setScale(next);
              }
            }}
            onEndEditing={() => setScaleNonce(n => n + 1)}
            keyboardType="numeric"
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.scaleBtn}
            accessibilityRole="button"
            accessibilityLabel="Tambah skala"
            onPress={() => {
              const next = Math.round((scale + 0.1) * 10) / 10;
              setScale(next);
              setScaleNonce(n => n + 1);
            }}>
            <Text style={styles.scaleBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ArSceneScreen;
