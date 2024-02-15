import { useAtom, atom } from "jotai"


import { ContactShadows, Environment, useCursor } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";
import { charactersAtom, socket } from "./components/SocketManager";
import { useState } from "react";


export function Experience() {
    const [characters] = useAtom(charactersAtom)
    const [onFoor, setOnFloor] = useState(false)
    useCursor(onFoor)

    return (
        <>
            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            <ContactShadows blur={2.5} />

            <mesh
                rotation-x={-Math.PI / 2}
                position-y={-0.001}
                onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
                onPointerEnter={() => setOnFloor(true)}
                onPointerLeave={() => setOnFloor(false)}
            >
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color={"#f0f0f0"} />
            </mesh>

            {
                characters.map((character) => (
                    <AnimatedWoman
                        key={character.id}
                        position={character.position}
                        hairColor={character.hairColor}
                        topColor={character.topColor}
                        bottomColor={character.bottomColor}
                    />
                ))
            }



            <AnimatedWoman />
            <AnimatedWoman position-x={1} hairColor="red" topColor="cyan" />
        </>
    )
}