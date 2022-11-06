import TexturePlane from '../components/TexturePlane'
import { uniforms, fragmentShader } from '../shaders/fbm-warping'
import vertexShader from '../shaders/vertex-default.vert'

const Scene = () => 
  <TexturePlane shaders={[vertexShader, fragmentShader, uniforms]} />

export default Scene