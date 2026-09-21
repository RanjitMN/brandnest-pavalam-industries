import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GPU-efficient smoke via InstancedMesh.
 * Particle count scales with quality tier.
 */
const SmokeEffect = ({ position = [0, 0.2, 0], count = 48 }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      phase: (i / count) * Math.PI * 2,
      speed: 0.18 + Math.random() * 0.28,
      drift: (Math.random() - 0.5) * 0.75,
      driftZ: (Math.random() - 0.5) * 0.75,
      maxHeight: 1.8 + Math.random() * 2.2,
      maxScale: 0.28 + Math.random() * 0.45,
      rotSpeed: (Math.random() - 0.5) * 0.4,
    }));
  }, [count]);

  const smokeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#E5D9C8'),
      transparent: true,
      opacity: 0.11,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      const life = ((time * p.speed + p.phase) % Math.PI) / Math.PI;
      const spread = life * life;
      const y = life * p.maxHeight;
      const x = Math.sin(time * 0.5 + p.phase) * p.drift * spread;
      const z = Math.cos(time * 0.3 + p.phase) * p.driftZ * spread;

      dummy.position.set(x, y, z);
      const s = Math.sin(life * Math.PI) * p.maxScale;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(
        time * p.rotSpeed,
        time * p.rotSpeed * 0.7,
        time * p.rotSpeed * 0.3
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    smokeMaterial.opacity = Math.sin(time * 0.8) * 0.025 + 0.11;
  });

  return (
    <group position={position}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        material={smokeMaterial}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 6]} />
      </instancedMesh>
    </group>
  );
};

export default SmokeEffect;
