import { useAtom, atom } from "jotai"


import { ContactShadows, Environment } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";
import { charactersAtom } from "./components/SocketManager";


export function Experience() {
    const [characters] = useAtom(charactersAtom)

    return (
        <>
            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            <ContactShadows blur={2.5} />

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