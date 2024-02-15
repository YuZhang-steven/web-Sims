import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Experience } from './Experience'
import { SocketManager } from './components/SocketManager'



function App() {


  return (
    <>

      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach="background" args={["#ececec"]}></color>
        <OrbitControls />
        <Experience />
      </Canvas>
    </>
  )
}

export default App
