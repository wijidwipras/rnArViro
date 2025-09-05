import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {
  ViroARScene,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroText,
  ViroMaterials,
  ViroNode,
  ViroQuad,
} from '@viro-community/react-viro';

const styles = StyleSheet.create({
  hintText: {fontSize: 16, color: '#00ff88'},
  reticle: {opacity: 0.6},
});

const ArScene: React.FC<any> = () => {
  const sceneRef = useRef<any>(null);
  const [placed, setPlaced] = useState(false);
  const [following, setFollowing] = useState(true);
  const [pos, setPos] = useState<[number, number, number] | null>(null);
  const [rot, setRot] = useState<[number, number, number] | null>(null);
  const [scale, setScale] = useState(0.4);
  const baseScaleRef = useRef(0.4);
  const wallMode =
    !!sceneRef.current?.props?.sceneNavigator?.viroAppProps?.wallMode;

  const isHorizontalRotation = (r?: [number, number, number]) => {
    if (!r) {
      return false;
    }
    const norm = (a: number) => Math.abs(((a + 180) % 360) - 180);
    const tiltX = norm(r[0]);
    const tiltZ = norm(r[2]);
    return tiltX < 25 && tiltZ < 25;
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
    } catch {}
  };

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
            if (
              (!wallMode && horizontalPlane) ||
              (wallMode && (horizontalPlane || planeHits[0]))
            ) {
              setPlaced(true);
              setFollowing(false);
            }
          }
        }
      } catch {}
    };
    interval = setInterval(tick, 200);
    return () => interval && clearInterval(interval);
  }, [following, placed, wallMode]);

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
      <ViroAmbientLight color="#FFFFFF" intensity={500} />
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -0.5]}
        castsShadow
        shadowOpacity={0.4}
      />

      {(!placed || following) && (
        <ViroText
          text="Arahkan ke bidang datar lalu ketuk untuk menempatkan"
          position={[0, 0.1, -0.7]}
          style={styles.hintText}
        />
      )}

      {following && pos && (
        <ViroNode position={pos} rotation={rot || [0, 0, 0]}>
          <ViroQuad
            materials={['reticle']}
            rotation={[-90, 0, 0]}
            position={[0, 0.01, 0]}
            width={0.08}
            height={0.08}
            style={styles.reticle}
          />
        </ViroNode>
      )}

      {(pos || placed) && pos && (
        <Viro3DObject
          source={require('../../cube.glb')}
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

export default ArScene;
