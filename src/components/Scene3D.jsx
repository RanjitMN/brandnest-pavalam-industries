import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, useGLTF } from '@react-three/drei';
import './Scene3D.css';

const MODEL_URL = '/models/model.glb';

function CupModel() {
  const group = useRef();
  const { scene } = useGLTF(MODEL_URL);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.28;
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

const Scene3D = () => {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '80px', threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="scene3d-container" ref={containerRef}>
      <Canvas
        camera={{ position: [0, 1.1, 3.6], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={[1, 1.5]}
        shadows={false}
        frameloop={visible ? 'always' : 'never'}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 3]} intensity={1.35} color="#fff4e0" />
        <pointLight position={[-2, 2, -2]} intensity={0.45} color="#C4A35A" />
        <Suspense fallback={null}>
          <CupModel />
          <Environment preset="sunset" environmentIntensity={0.35} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
