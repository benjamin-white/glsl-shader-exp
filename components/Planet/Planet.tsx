import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { LayerMaterial, Depth, Fresnel } from 'lamina';
import { useRef } from 'react';
import CustomLayer from './CustomLayer';

extend({ CustomLayer });

const Planet = () => {
  const materialRef = useRef(null!);

  useFrame((state) => {
    // @ts-ignore
    materialRef.current.time = state.clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={1.5}>
      <icosahedronGeometry args={[2, 11]} />
      <LayerMaterial lighting="lambert">
        { /* @ts-ignore */ }
        <customLayer ref={materialRef} time={0.0} lacunarity={2.3} />
        <Depth colorA="blue" colorB="aqua" alpha={0.9} mode="add" />
        <Fresnel color="#FEB3D9" mode="add" />
      </LayerMaterial>
    </mesh>
  );
};

const Scene = () => {
  return (
    <div style={{ width: '600px', height: '600px' }}>
      <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
        <ambientLight intensity={0.03} />
        <directionalLight position={[0.3, 0.15, 0.0]} intensity={2} />
        <Planet />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene;
