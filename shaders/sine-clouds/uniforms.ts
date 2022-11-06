import * as THREE from 'three';

const uniforms = {
  u_resolution: {
    type: 'vec2',
    value: new THREE.Vector2(600, 600)
  },
  u_time: {
    type: 'float',
    value: 1.0
  }
}

export default uniforms