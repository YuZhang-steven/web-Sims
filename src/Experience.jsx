import { Environment } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";

export function Experience() {
    return (
        <>
            <Environment preset="sunset" />
            <ambientLight intensity={0.5} />
            <AnimatedWoman />
        </>
    )
}