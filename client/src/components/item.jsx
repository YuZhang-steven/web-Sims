import { useGLTF } from "@react-three/drei"
import { useAtom } from "jotai"
import { mapAtom } from "./SocketManager"
import { SkeletonUtils } from "three-stdlib"
import React, { useMemo } from 'react'



export const Item = ({ item }) => {
    const { name, gridPosition, size, rotation } = item
    // console.log(rotation);
    const [map] = useAtom(mapAtom)
    const { scene } = useGLTF(`models/items/${name}.glb`)

    //clone the skinnedmesh
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

    return (
        <primitive object={clone}
            position={[
                size[0] / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
                0,
                size[1] / map.gridDivision / 2 + gridPosition[1] / map.gridDivision
            ]}
            rotation-y={(rotation || 0) * Math.PI / 2}
        />

    )
}