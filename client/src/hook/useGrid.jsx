import { useAtom } from "jotai"
import { mapAtom } from "../components/SocketManager"
import * as THREE from "three"

/**
 * 
 * create two normal use methods with hook
 */

export const useGrid = () => {
    const [map] = useAtom(mapAtom)

    /**
     * convert three js coordinate to the game grid coordinate
     * @returns [x, y]
     */
    const vector3ToGrid = (vector3) => {
        //gridDivision is the number of the cell in one three js unit
        //the cell start from 1, so we need to use Math.floor to get the correct cell number
        return [
            Math.floor(vector3.x * map.gridDivision),
            Math.floor(vector3.z * map.gridDivision)
        ]
    }

    /**
    * convert game grid coordinate to the three js coordinate
    * @param gridPosition [x, y], 
    * @returns three vecotr3
    */
    const gridToVector3 = (gridPosition, width = 1, height = 1) => {
        return new THREE.Vector3(
            width / map.gridDivision / 2 //width / divistion to get the one cell width in three js coordinate. divide  2 to center the location.
            + gridPosition[0] / map.gridDivision,
            0,
            height / map.gridDivision / 2
            + gridPosition[1] / map.gridDivision
        )
    }

    return { vector3ToGrid, gridToVector3 }
}