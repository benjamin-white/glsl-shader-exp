import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Shader = {
  uniforms: {
    u_time: {
      value: number
    };
  }
}

type MeshMat = THREE.Mesh & {
  material: Shader;
}

const Plane = ({ shaders }: { shaders: any }) => {

  const ref = useRef<MeshMat>(null!);
  const [vertexShader, fragmentShader, uniforms] = shaders
  const memoForms = useMemo(() => uniforms, [uniforms])

  useFrame((state) => {
    ref.current.material.uniforms.u_time.value = state.clock.getElapsedTime() * 3;
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]} scale={1.0}>
      <planeGeometry args={[1, 1, 96, 96]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={memoForms}
      />
    </mesh>
  );
};

const TexturePlane = ({ shaders }: { shaders: any }) =>
  <div style={{ width: '600px', height: '600px' }}>
    <Canvas camera={{ position: [0.0, 0.0, .7] }}>
      <Plane shaders={shaders} />
    </Canvas>
  </div>

export default TexturePlane
