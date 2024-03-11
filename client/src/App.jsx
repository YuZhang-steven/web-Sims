// import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Experience } from './Experience'
import { SocketManager } from './components/SocketManager'
import { UI } from './components/UI'
import { ScrollControls } from '@react-three/drei'



/**
 * 
 * The major App functions includes the part outside the canvas and the canvas itself
 */
function App() {


  return (
    <>

      {/* the socket connection handle */}
      <SocketManager />

      {/* major three js function */}
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 30 }}
      >
        <color attach="background" args={["#ececec"]}></color>
        <ScrollControls>
          <Experience />
        </ScrollControls>


      </Canvas>

      <UI />
    </>
  )
}

export default App
