import { useAtom } from "jotai"
import * as THREE from "three"


import { ContactShadows, Environment, useCursor } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";
import { charactersAtom, mapAtom, socket } from "./components/SocketManager";
import { useEffect, useState } from "react";
import { Item } from "./components/item";
import { useThree } from "@react-three/fiber";


export function Experience() {
    //get the character list from the socket message
    const [characters] = useAtom(charactersAtom)
    const [map] = useAtom(mapAtom)
    console.log(map.gridDivision);


    const [dataReady, setDataReady] = useState(false)

    const scenne = useThree((state) => state.scene)
    const [user] = useAtom(userAtom)

    const onCharacterMove = (e) => {
        const character = scenne.getObjectByName(`character-${user}`)
        if (!character) { return }
        // socket.emit("move", {


    }




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
                onClick={onCharacterMove}

                //mouse hover, the mouse symbol change
                onPointerEnter={() => setOnFloor(true)}
                onPointerLeave={() => setOnFloor(false)}
                position-x={map.size[0] / 2}
                position-z={map.size[1] / 2}
            >
                <planeGeometry args={map.size} />
                <meshStandardMaterial color={"#f0f0f0"} />
            </mesh>

            {
                map.items.map((item, idx) => (
                    <Item key={`${item.name}-${idx}`} item={item} />
                ))
            }


            {/* when mounting, create each characters based on the charactee list */}
            {
                characters.map((character) => (
                    <AnimatedWoman
                        key={character.id}
                        id={character.id}
                        position={new THREE.Vector3(
                            character.position[0] / map.gridDivision + 1 / map.gridDivision / 2,
                            0,
                            character.position[1] / map.gridDivision + 1 / map.gridDivision / 2
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