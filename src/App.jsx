import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Experience } from './Experience'



function App() {


  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <color attach="background" args={["#ececec"]}></color>
      <OrbitControls />
      <Experience />
    </Canvas>
  )
}

export default App
