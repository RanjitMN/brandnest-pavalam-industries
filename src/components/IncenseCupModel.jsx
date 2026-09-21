import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural cup sambrani — LatheGeometry + warm PBR materials.
 */
const IncenseCupModel = ({ position = [0, -0.5, 0], scale = 1 }) => {
  const groupRef = useRef();
  const glowRef = useRef();

  const cupGeometry = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.35, 0));
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const angle = t * Math.PI * 0.4;
      const x = 0.35 + Math.sin(angle) * 0.25;
      const y = (1 - Math.cos(angle)) * 0.3;
      points.push(new THREE.Vector2(x, y));
    }
    points.push(new THREE.Vector2(0.65, 0.28));
    points.push(new THREE.Vector2(0.68, 0.32));
    points.push(new THREE.Vector2(0.67, 0.35));
    points.push(new THREE.Vector2(0.63, 0.36));
    points.push(new THREE.Vector2(0.60, 0.34));
    return new THREE.LatheGeometry(points, 28);
  }, []);

  const innerGeometry = useMemo(() => {
    const points = [];
    points.push(new THREE.Vector2(0, 0.08));
    points.push(new THREE.Vector2(0.30, 0.08));
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      points.push(new THREE.Vector2(0.30 + t * 0.28, 0.08 + t * 0.22));
    }
    return new THREE.LatheGeometry(points, 28);
  }, []);

  const emberGeometry = useMemo(() => new THREE.CircleGeometry(0.28, 20), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity =
        Math.sin(state.clock.elapsedTime * 2) * 0.28 + 0.65;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh geometry={cupGeometry}>
        <meshStandardMaterial
          color="#A05A2C"
          roughness={0.88}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={innerGeometry}>
        <meshStandardMaterial
          color="#6B3A1A"
          roughness={0.95}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh
        ref={glowRef}
        geometry={emberGeometry}
        position={[0, 0.18, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#1A100C"
          emissive="#E85D04"
          emissiveIntensity={0.65}
          roughness={1}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, 0.33, 0]}>
        <torusGeometry args={[0.66, 0.014, 8, 28]} />
        <meshStandardMaterial color="#C4A35A" roughness={0.35} metalness={0.65} />
      </mesh>

      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.37, 28]} />
        <meshStandardMaterial color="#C4A35A" roughness={0.4} metalness={0.55} />
      </mesh>
    </group>
  );
};

export default IncenseCupModel;
