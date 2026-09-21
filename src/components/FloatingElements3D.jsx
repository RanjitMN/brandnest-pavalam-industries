import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Lightweight floating accents — no Float helper (saves RAF work).
 * Only mounted on high-tier GPUs.
 */

const Leaf = ({ position, delay = 0 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + delay;
    meshRef.current.rotation.y = t * 0.25;
    meshRef.current.rotation.z = Math.sin(t * 0.45) * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.7) * 0.08;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.14, 0.22]} />
      <meshStandardMaterial
        color="#3F6B38"
        roughness={0.85}
        metalness={0}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const GoldenParticle = ({ position, size = 0.035 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 1.4 + position[0] * 3) * 0.12;
    meshRef.current.material.emissiveIntensity =
      Math.sin(t * 2 + position[0] * 5) * 0.35 + 0.35;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshStandardMaterial
        color="#C4A35A"
        emissive="#C4A35A"
        emissiveIntensity={0.35}
        roughness={0.25}
        metalness={0.75}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
};

const FloatingElements3D = () => {
  return (
    <group>
      <Leaf position={[-1.15, 0.55, 0.25]} delay={0} />
      <Leaf position={[1.2, 0.75, -0.2]} delay={1.4} />
      <Leaf position={[-0.75, 1.15, -0.45]} delay={2.8} />

      <GoldenParticle position={[-0.55, 1.05, 0.35]} size={0.032} />
      <GoldenParticle position={[0.65, 1.25, -0.25]} size={0.024} />
      <GoldenParticle position={[-0.25, 1.7, 0.15]} size={0.028} />
      <GoldenParticle position={[0.45, 0.65, 0.45]} size={0.02} />
      <GoldenParticle position={[0.15, 1.9, -0.35]} size={0.026} />
    </group>
  );
};

export default FloatingElements3D;
