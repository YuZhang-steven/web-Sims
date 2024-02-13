import { Environment } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";
import { AnimatedWomanIns, Model } from "./assets/AnimatedWomanIns";

export function Experience() {
    return (
        <>
            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            <AnimatedWomanIns >
                <Model />
            </AnimatedWomanIns>

            <AnimatedWoman />
            {/* <AnimatedWoman position-x={1} hairColor="red" topColor="cyan" /> */}
        </>
    )
}