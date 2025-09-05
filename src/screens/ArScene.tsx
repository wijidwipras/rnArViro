import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Platform, ToastAndroid} from 'react-native';
import {
  ViroARScene,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroText,
  ViroNode,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroAnimations,
} from '@viro-community/react-viro';

const styles = StyleSheet.create({
  hintText: {fontSize: 16, color: '#00ff88'},
});

// Register marker target and basic animations (idempotent)
try {
  ViroARTrackingTargets.createTargets({
    markerA: {
      source: require('../assets/markers/markerA.png'),
      orientation: 'Up',
      physicalWidth: 0.1, // meters (10 cm)
    },
  });
} catch {}
try {
  ViroAnimations.registerAnimations({
    fadeIn: {properties: {opacity: 1.0}, duration: 250, easing: 'EaseIn'},
    fadeOut: {properties: {opacity: 0.0}, duration: 250, easing: 'EaseOut'},
  });
} catch {}

const ArScene: React.FC<any> = () => {
  const sceneRef = useRef<any>(null);
  const [scale, setScale] = useState(0.4);
  const baseScaleRef = useRef(0.4);
  const [markerVisible, setMarkerVisible] = useState(false);
  const prevMarkerVisibleRef = useRef(false);
  const lastToastAtRef = useRef(0);
  const lastTapAtRef = useRef(0);
  const [detached, setDetached] = useState(false);
  const [detachedPos, setDetachedPos] = useState<
    [number, number, number] | null
  >(null);

  // Sync external scale from viroAppProps
  useEffect(() => {
    const ext = sceneRef.current?.props?.sceneNavigator?.viroAppProps;
    if (ext && typeof ext.scale === 'number' && !Number.isNaN(ext.scale)) {
      const clamped = Math.max(0.01, ext.scale); // no upper bound
      setScale(clamped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneRef.current?.props?.sceneNavigator?.viroAppProps?.scaleNonce]);

  // Toast on marker state changes (Android) with basic throttling
  useEffect(() => {
    const showToast = (msg: string) => {
      if (Platform.OS === 'android') {
        const now = Date.now();
        if (now - lastToastAtRef.current > 1500) {
          ToastAndroid.showWithGravityAndOffset(
            msg,
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
            0,
            80,
          );
          lastToastAtRef.current = now;
        }
      }
    };
    if (!prevMarkerVisibleRef.current && markerVisible) {
      showToast('Marker terdeteksi');
    } else if (prevMarkerVisibleRef.current && !markerVisible) {
      showToast('Marker hilang');
    }
    prevMarkerVisibleRef.current = markerVisible;
  }, [markerVisible]);

  const handleSceneTap = async () => {
    const now = Date.now();
    if (now - lastTapAtRef.current < 300) {
      // Double tap detected → place object in front of camera
      try {
        const place = (pos: number[], fwd: number[], dist = 0.6) => {
          const target: [number, number, number] = [
            pos[0] + fwd[0] * dist,
            pos[1] + fwd[1] * dist,
            pos[2] + fwd[2] * dist,
          ];
          setDetachedPos(target);
          setDetached(true);
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravityAndOffset(
              'Objek dipindah ke depan Anda',
              ToastAndroid.SHORT,
              ToastAndroid.TOP,
              0,
              80,
            );
          }
        };
        if (sceneRef.current?.getCameraOrientationAsync) {
          const maybe = sceneRef.current.getCameraOrientationAsync();
          if (maybe && typeof maybe.then === 'function') {
            const o = await maybe;
            const pos = o?.position || o?.cameraPosition || [0, 0, 0];
            const fwd = o?.forward || o?.cameraForward || [0, 0, -1];
            place(pos, fwd);
          } else if (
            typeof sceneRef.current.getCameraOrientationAsync === 'function'
          ) {
            sceneRef.current.getCameraOrientationAsync(
              (pos: number[], fwd: number[]) => {
                place(pos, fwd);
              },
            );
          }
        }
      } catch {}
      lastTapAtRef.current = 0;
      return;
    }
    lastTapAtRef.current = now;
  };

  return (
    <ViroARScene ref={sceneRef} onClick={handleSceneTap}>
      <ViroAmbientLight color="#FFFFFF" intensity={500} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.5]}
        castsShadow
        shadowOpacity={0.4}
      />

      {!markerVisible && (
        <ViroText
          text="Arahkan kamera ke marker untuk menampilkan objek"
          position={[0, 0.1, -0.7]}
          style={styles.hintText}
        />
      )}

      {detached && detachedPos ? (
        <ViroNode opacity={0} animation={{name: 'fadeIn', run: true}}>
          <Viro3DObject
            source={require('../assets/models/cube.glb')}
            type="GLB"
            position={detachedPos}
            rotation={[0, 0, 0]}
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
                const next = Math.max(0.01, baseScaleRef.current * scaleFactor);
                setScale(next);
              }
            }}
          />
        </ViroNode>
      ) : (
        <ViroARImageMarker
          target="markerA"
          onAnchorFound={() => setMarkerVisible(true)}
          onAnchorRemoved={() => setMarkerVisible(false)}>
          <ViroNode
            opacity={0}
            animation={{name: markerVisible ? 'fadeIn' : 'fadeOut', run: true}}>
            <Viro3DObject
              source={require('../assets/models/cube.glb')}
              type="GLB"
              position={[0, 10, 0]}
              rotation={[0, 0, 0]}
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
                  const next = Math.max(
                    0.01,
                    baseScaleRef.current * scaleFactor,
                  );
                  setScale(next);
                }
              }}
            />
          </ViroNode>
        </ViroARImageMarker>
      )}
    </ViroARScene>
  );
};

export default ArScene;
