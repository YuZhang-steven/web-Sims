import { ContactShadows, Environment } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";

export function Experience() {
    return (
        <>
            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            <ContactShadows blur={2.5} />

            <AnimatedWoman />
            <AnimatedWoman position-x={1} hairColor="red" topColor="cyan" />
        </>
    )
}