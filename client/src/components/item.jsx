import { useGLTF } from "@react-three/drei"
import { useAtom } from "jotai"
import { mapAtom } from "./SocketManager"
import { SkeletonUtils } from "three-stdlib"
import React, { useMemo } from 'react'
import { useGrid } from "../hook/useGrid"


/**
 * Item component loading template
 * @param {*} param0 
 * item object : {
 *      name, 
 *      size, 
 *      gridposition,
 *      rotation
 * },
 * onClick effect,
 * Dragging state,
 * dragPosition
 * 
 * 
 * 
 * @returns three js primitive with position and rotation
 */
export const Item = ({ item, onClick, isDragging, dragPosition, dragrotation, canDrop }) => {
    //decounstruct the item object
    const { name, gridPosition, size, rotation: itemRotaion } = item

    const rotation = isDragging ? dragrotation : itemRotaion

    // getting map object from the globle sate
    const [map] = useAtom(mapAtom)
    //load the gltf file
    const { scene } = useGLTF(`models/items/${name}.glb`)

    //clone the skinnedmesh
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
    //calculate the width and the height of the item
    //if rotated, switch the width and the height
    const width = rotation === 1 || rotation === 3 ? size[1] : size[0]
    const height = rotation === 1 || rotation === 3 ? size[0] : size[1]

    //get the gridToVector3 method from the useGrid hook
    const { gridToVector3 } = useGrid()


    return (
        //create the new primitive object with the cloned mesh and the three js coordinate
        <group
            onClick={onClick}
            position={gridToVector3(isDragging ? (dragPosition || gridPosition) : gridPosition, width, height)}
        >
            <primitive object={clone}
                rotation-y={(rotation || 0) * Math.PI / 2}
            />
            {isDragging && (
                <mesh>
                    <boxGeometry args={[width / map.gridDivision, 0.2, height / map.gridDivision]} />
                    <meshBasicMaterial color={canDrop ? 'green' : 'red'} opacity={0.3} transparent />
                </mesh>
            )}

        </group>

    )
}