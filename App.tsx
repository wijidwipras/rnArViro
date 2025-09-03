/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {
  ViroARSceneNavigator,
  ViroARScene,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroText,
  ViroMaterials,
  ViroNode,
  ViroQuad,
} from '@viro-community/react-viro';

const HelloARScene = () => {
  const sceneRef = useRef<any>(null);
  const [placed, setPlaced] = useState(false);
  const [following, setFollowing] = useState(true);
  const [pos, setPos] = useState<[number, number, number] | null>(null);
  const [rot, setRot] = useState<[number, number, number] | null>(null);
  const [scale, setScale] = useState(0.4);
  const baseScaleRef = useRef(0.4);
  const wallMode =
    !!sceneRef.current?.props?.sceneNavigator?.viroAppProps?.wallMode;

  // Heuristik: anggap plane horizontal bila rotasi X/Z kecil (derajat)
  const isHorizontalRotation = (r?: [number, number, number]) => {
    if (!r) {
      return false;
    }
    const norm = (a: number) => Math.abs(((a + 180) % 360) - 180);
    const tiltX = norm(r[0]);
    const tiltZ = norm(r[2]);
    return tiltX < 25 && tiltZ < 25; // toleransi ~25 derajat
  };

  const handleTapToPlace = async (evt: any) => {
    try {
      const click = evt?.nativeEvent || evt;
      const [x, y] = click?.clickPos || [];
      if (
        sceneRef.current &&
        typeof sceneRef.current.performARHitTestWithPoint === 'function' &&
        x != null &&
        y != null
      ) {
        const results = await sceneRef.current.performARHitTestWithPoint(x, y);
        if (Array.isArray(results) && results.length > 0) {
          // Preferensi plane: jika wallMode off, pilih horizontal; jika on, izinkan semua plane
          const planeHits = results.filter(
            (r: any) =>
              r?.type === 'ExistingPlaneUsingGeometry' ||
              r?.type === 'ExistingPlaneUsingExtent' ||
              r?.type === 'EstimatedHorizontalPlane',
          );
          const horizontalHit = planeHits.find((h: any) =>
            isHorizontalRotation(
              (h?.transform?.rotation || h?.rotation) as any,
            ),
          );
          const hit =
            (!wallMode && horizontalHit) ||
            (wallMode && (horizontalHit || planeHits[0])) ||
            results[0];
          const t = hit?.transform || hit;
          if (t?.position) {
            setPos(t.position as [number, number, number]);
          }
          if (t?.rotation) {
            setRot(t.rotation as [number, number, number]);
          }
          setPlaced(true);
          setFollowing(false);
        }
      }
    } catch (e) {
      console.warn('Hit test failed', e);
    }
  };

  // Auto-follow: lakukan hit-test di titik tengah layar dan ikuti sampai plane stabil ditemukan.
  useEffect(() => {
    let interval: any;
    const tick = async () => {
      if (!sceneRef.current || !following || placed) {
        return;
      }
      try {
        const {width, height} = Dimensions.get('window');
        const x = Math.floor(width / 2);
        const y = Math.floor(height / 2);
        if (typeof sceneRef.current.performARHitTestWithPoint === 'function') {
          const results = await sceneRef.current.performARHitTestWithPoint(
            x,
            y,
          );
          if (Array.isArray(results) && results.length > 0) {
            // Prioritaskan plane horizontal (kecuali wallMode aktif), jika belum ada gunakan estimasi/feature point
            const planeHits = results.filter(
              (r: any) =>
                r?.type === 'ExistingPlaneUsingGeometry' ||
                r?.type === 'ExistingPlaneUsingExtent',
            );
            const horizontalPlane = planeHits.find((h: any) =>
              isHorizontalRotation(
                (h?.transform?.rotation || h?.rotation) as any,
              ),
            );
            const fallbackHit =
              results.find(
                (r: any) =>
                  r?.type === 'EstimatedHorizontalPlane' ||
                  r?.type === 'FeaturePoint',
              ) || results[0];
            const chosen =
              (!wallMode && horizontalPlane) ||
              (wallMode && (horizontalPlane || planeHits[0])) ||
              fallbackHit;
            const t = chosen?.transform || chosen;
            if (t?.position) {
              setPos(t.position as [number, number, number]);
            }
            if (t?.rotation) {
              setRot(t.rotation as [number, number, number]);
            }
            // Jika plane horizontal nyata ditemukan, otomatis snap dan berhenti follow
            if (
              (!wallMode && horizontalPlane) ||
              (wallMode && (horizontalPlane || planeHits[0]))
            ) {
              setPlaced(true);
              setFollowing(false);
            }
          }
        }
      } catch (e) {
        // diamkan; ini berjalan berkala
      }
    };
    interval = setInterval(tick, 200);
    return () => interval && clearInterval(interval);
  }, [following, placed, wallMode]);

  // Reticle material (sekali, di-invoke saat modul di-load), aman dipanggil idempotent
  ViroMaterials.createMaterials({
    reticle: {
      diffuseColor: '#00ff88',
      lightingModel: 'Lambert',
      writesToDepthBuffer: true,
      colorWritesMask: 'All',
    },
  });

  return (
    <ViroARScene ref={sceneRef} onClick={handleTapToPlace}>
      {/* Pencahayaan agar material PBR pada GLB terlihat */}
      <ViroAmbientLight color="#FFFFFF" intensity={500} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.5]}
        castsShadow
        shadowOpacity={0.4}
      />

      {/* Petunjuk/marker sampai pengguna memilih bidang datar */}
      {(!placed || following) && (
        <ViroText
          text="Arahkan ke bidang datar lalu ketuk untuk menempatkan"
          position={[0, 0.1, -0.7]}
          style={{fontSize: 16, color: '#00ff88'}}
        />
      )}

      {/* Reticle: tampil saat mengikuti pusat layar dan sudah ada estimasi posisi */}
      {following && pos && (
        <ViroNode position={pos} rotation={rot || [0, 0, 0]}>
          <ViroQuad
            materials={['reticle']}
            rotation={[-90, 0, 0]}
            position={[0, 0.01, 0]}
            width={0.08}
            height={0.08}
            opacity={0.6}
          />
        </ViroNode>
      )}

      {(pos || placed) && pos && (
        <Viro3DObject
          source={require('./cube.glb')}
          type="GLB"
          position={pos}
          rotation={rot || [0, 0, 0]}
          scale={[scale, scale, scale]}
          onLoadStart={() => console.log('GLB load start')}
          onLoadEnd={() => console.log('GLB load end')}
          onError={(e: any) =>
            console.warn('GLB load error', e?.nativeEvent || e)
          }
          onPinch={(pinchState: number, scaleFactor: number) => {
            if (pinchState === 1) {
              baseScaleRef.current = scale;
            } else if (pinchState === 2) {
              const next = Math.min(
                3,
                Math.max(0.1, baseScaleRef.current * scaleFactor),
              );
              setScale(next);
            }
          }}
        />
      )}
    </ViroARScene>
  );
};

const App: React.FC = () => {
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
    <View style={{flex: 1}}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{scene: HelloARScene}}
        viroAppProps={{wallMode}}
        style={{flex: 1}}
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

const styles = StyleSheet.create({
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
  active: {
    backgroundColor: 'rgba(0,150,0,0.7)',
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default App;
