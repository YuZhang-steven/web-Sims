import { useCursor, useGLTF } from "@react-three/drei"
import { useAtom } from "jotai"
import { mapAtom } from "./SocketManager"
import { SkeletonUtils } from "three-stdlib"
import React, { useMemo, useState } from 'react'
import { useGrid } from "../hook/useGrid"
import { buildModeAtom } from "./UI"



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
 * isDragging state,
 * dragPosition state,
 * dragRotation state,
 * canDrop state
 * 
 * @returns three js primitive with position and rotation
 */
export const Item = ({ item, onClick, isDragging, dragPosition, dragRotation, canDrop }) => {
    //decounstruct the item object. rotation rename to itemRotaion(original rotation setting in blender)
    const { name, gridPosition, size, rotation: itemRotaion } = item

    //in Dragging situation, we use the dragging temporary rotation
    const rotation = isDragging ? dragRotation : itemRotaion

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

    //if dragging or hover on an item, the hover state will be true(use to set the cursor)
    const [hover, setHover] = useState(false)
    //get the buildMode state from the global state
    const [buildMode] = useAtom(buildModeAtom)

    /**Hook */
    //change the cursor to reflect hover state when in build mode
    useCursor(buildMode ? hover : undefined)


    return (
        //create the new primitive object with the cloned mesh and the three js coordinate
        <group
            //pass the onclick event to the group
            //(the item is a custom compponent, so we need to pass the event to the group to make it work)
            onClick={onClick}
            position={gridToVector3(
                //CHECK: what is the situation that dragposition is undefined in dragging mode?
                /**
                    If isDragging is true, it evaluates (dragPosition || gridPosition). 
                    This means that if dragPosition is truthy, it will use that value; otherwise, it will use gridPosition.
                    If isDragging is false, it directly uses gridPosition.
                 */
                isDragging ? (dragPosition || gridPosition) : gridPosition,
                width,
                height
            )}

            //set the hover when the mouse enter or leave the item
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
        >
            <primitive object={clone}
                rotation-y={(rotation || 0) * Math.PI / 2}
            />
            {/* if dragging an item, show a check plan below, if can drap, it will be gree; otherwise will be red */}
            {isDragging && (
                <mesh>
                    <boxGeometry args={[width / map.gridDivision, 0.2, height / map.gridDivision]} />
                    <meshBasicMaterial color={canDrop ? 'green' : 'red'} opacity={0.3} transparent />
                </mesh>
            )}

        </group>

    )
}