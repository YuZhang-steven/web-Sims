import { useAtom } from "jotai"
import { mapAtom } from "../components/SocketManager"
import * as THREE from "three"

/**
 * 
 * create two normal use method with hook
 */

export const useGrid = () => {
    const [map] = useAtom(mapAtom)

    /**
     * convert vector3 to grid position form
     * @returns 
     */
    const vector3ToGrid = (vector3) => {
        return [
            Math.floor(vector3.x / map.gridDivision),
            Math.floor(vector3.z / map.gridDivision)
        ]
    }

    /**
    * convert grid position to vector3
    * @returns 
    */
    const gridToVector3 = (gridPosition, width = 1, heigt = 1) => {
        return new THREE.Vector3(
            width / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
            0,
            heigt / map.gridDivision / 2 + gridPosition[1] / map.gridDivision
        )
    }

    return { vector3ToGrid, gridToVector3 }
}