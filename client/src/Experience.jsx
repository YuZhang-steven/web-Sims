import { useAtom } from "jotai"
import * as THREE from "three"


import { ContactShadows, Environment, useCursor } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";
import { charactersAtom, socket } from "./components/SocketManager";
import { useState } from "react";


export function Experience() {
    //get the character list from the socket message
    const [characters] = useAtom(charactersAtom)

    // set the effect that when cursor on specific situation, it become the hand pointer symbol
    const [onFoor, setOnFloor] = useState(false)
    useCursor(onFoor)

    return (
        <>
            {/* Environment setting */}
            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            <ContactShadows blur={2.5} />

            {/*  Floor */}
            <mesh
                rotation-x={-Math.PI / 2}
                position-y={-0.001}
                //when clicking, send the intersection point information to the server to update the characters.
                onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}

                //mouse hover, the mouse symbol change
                onPointerEnter={() => setOnFloor(true)}
                onPointerLeave={() => setOnFloor(false)}
            >
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color={"#f0f0f0"} />
            </mesh>

            {/* when mounting, create each characters based on the charactee list */}
            {
                characters.map((character) => (
                    <AnimatedWoman
                        key={character.id}
                        position={new THREE.Vector3(
                            character.position[0],
                            character.position[1],
                            character.position[2]
                        )}
                        hairColor={character.hairColor}
                        topColor={character.topColor}
                        bottomColor={character.bottomColor}
                    />
                ))
            }



            {/* test characters */}
            {/* <AnimatedWoman />
            <AnimatedWoman position-x={1} hairColor="red" topColor="cyan" /> */}
        </>
    )
}