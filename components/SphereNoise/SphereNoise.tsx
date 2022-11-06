import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils } from 'three';
import {
  vertexShader,
  fragmentShader,
  uniforms,
} from '../../shaders/sphere-noise';

type Shader = {
  uniforms: {
    u_time: {
      value: number
    };
    u_intensity: {
      value: number;
    }
  }
}

type MeshMat = THREE.Mesh & {
  material: Shader;
}

const Blob = () => {

  const mesh = useRef<MeshMat>(null!);
  const hover = useRef(false);

  useFrame((state) => {
    mesh.current.material.uniforms.u_time.value = 0.4 * state.clock.getElapsedTime();

    mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
      mesh.current.material.uniforms.u_intensity.value,
      hover.current ? 0.85 : 0.0,
      0.02
    );
  });

  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      scale={1.5}
      onPointerOver={() => (hover.current = true)}
      onPointerOut={() => (hover.current = false)}
    >
      <icosahedronGeometry args={[2, 20]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <div style={{ width: '600px', height: '600px' }}>
      <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
        <Blob />
        <axesHelper />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene;