import { useAtom } from "jotai"
import * as THREE from "three"


import { ContactShadows, Environment, Grid, useCursor, OrbitControls } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";
import { charactersAtom, mapAtom, socket, userAtom } from "./components/SocketManager";
import { useEffect, useRef, useState } from "react";
import { Item } from "./components/item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "./hook/useGrid";
import { buildModeAtom, draggedItemAtom, draggedItemRotationAtom } from "./components/UI";


export function Experience() {
    //change between playing and building mode
    const [buildMode, setBuildMode] = useAtom(buildModeAtom)
    //get the character list from the socket message
    const [characters] = useAtom(charactersAtom)
    //get the map information from the socket message
    const [map] = useAtom(mapAtom)

    //The items we are dragging
    const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom)
    const [draggedItemRotation, setDraggedItemRotation] = useAtom(draggedItemRotationAtom)
    const [dragPosition, setDragPosition] = useState(null)
    const [canDrop, setCanDrop] = useState(false)
    const [items, setItems] = useState(map.items)

    useEffect(() => {
        //if we don drag item,we don't care about update
        if (!draggedItem) {
            return
        }
        const item = items[draggedItem]
        const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0]
        const height = item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1]

        let droppable = true

        /** Check if we can drop the item in current location */
        //check if item in bound
        if (dragPosition[0] < 0 || dragPosition[0] + width > map.size[0] * map.gridDivision ||
            dragPosition[1] < 0 || dragPosition[1] + height > map.size[1] * map.gridDivision) {
            droppable = false
        }
        //check if the item is overlapping with other items
        //if item is walkable or on the wall, we don't need to check it
        if (!item.walkable && !item.wall) {
            items.forEach((otherItem, idx) => {
                //ignore itself
                if (idx === draggedItem) {
                    return
                }
                //ignore wall and walkable items
                if (otherItem.walkable || otherItem.wall) {
                    return
                }
                //check if the item is overlapping with other items
                //apply width and height
                const otherWidth = otherItem.rotation === 1 || otherItem.rotation === 3 ? otherItem.size[1] : otherItem.size[0]
                const otherHeight = otherItem.rotation === 1 || otherItem.rotation === 3 ? otherItem.size[0] : otherItem.size[1]

                if (dragPosition[0] < otherItem.gridPosition[0] + otherWidth &&
                    dragPosition[0] + width > otherItem.gridPosition[0] &&
                    dragPosition[1] < otherItem.gridPosition[1] + otherHeight &&
                    dragPosition[1] + height > otherItem.gridPosition[1]) {
                    droppable = false
                }

            });
        }


        setCanDrop(droppable)


    }, [dragPosition, draggedItem, items])



    //get the coordinate convert method from the useGrid hook
    const { vector3ToGrid, gridToVector3 } = useGrid()

    //future funcion to check if data loaded
    // const [dataReady, setDataReady] = useState(false)

    //This hook gives you access to the state model which 
    //contains the default renderer, the scene, your camera, and so on.
    //It also gives you the current size of the canvas in screen and viewport coordinates.
    const scene = useThree((state) => state.scene)
    const [user] = useAtom(userAtom)//retrieve current user id

    /**
     * the function to handle the character move
     * @param {*} e mouse click location(the final destination of the character)
     * character.position, the start postion.
     */

    const onPlaneClicked = (e) => {
        /** if it is on character mode, we do character move */
        if (!buildMode) {
            //find the right character in the character list
            const character = scene.getObjectByName(`character-${user}`)
            if (!character) {
                return
            }
            socket.emit(
                "move",
                vector3ToGrid(character.position),
                vector3ToGrid(e.point)
            )
        }
        /** if it is build mode, we move current item */
        else {
            if (draggedItem !== null) {
                if (canDrop) {
                    setItems((prev) => {
                        const newItems = [...prev]
                        newItems[draggedItem].gridPosition = vector3ToGrid(e.point)
                        newItems[draggedItem].rotation = draggedItemRotation
                        return newItems
                    })
                }
                setDraggedItem(null)
            }
        }

    }





    // set the effect that when cursor on specific situation, it become the hand pointer symbol
    const [onFoor, setOnFloor] = useState(false)
    useCursor(onFoor)


    const controls = useRef()
    const state = useThree((state) => state)

    useEffect(() => {
        if (buildMode) {
            setItems(map?.items || [])
            state.camera.position.set(8, 8, 8)
            controls.current.target.set(0, 0, 0)
        }
        //when left the build mode, call server update the items
        else {
            socket.emit("itemsUpdated", items)
        }
    }, [buildMode])


    return (
        <>
            {/* Environment setting */}
            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            <OrbitControls
                ref={controls}
                minDistance={5}
                maxDistance={20}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                screenSpacePanning={false}
            />
            {/* <ContactShadows blur={2.5} /> */}

            {/*  Floor */}
            <mesh
                rotation-x={-Math.PI / 2}
                position-y={-0.001}
                //when clicking, send the intersection point information to the server to update the characters.
                onClick={onPlaneClicked}

                //mouse hover, the mouse symbol change
                onPointerEnter={() => setOnFloor(true)}
                onPointerLeave={() => setOnFloor(false)}

                onPointerMove={(e) => {
                    //if it is playing mode, we don't want to move forniture
                    if (!buildMode) {
                        return
                    }
                    //calculate new item postion
                    const newPosition = vector3ToGrid(e.point)
                    //check if we have a drag position and both X and Y coordinates are different than original postion
                    if (!dragPosition ||
                        dragPosition[0] !== newPosition[0] ||
                        dragPosition[1] !== newPosition[1]
                    ) {

                        setDragPosition(newPosition)
                    }
                }}

                position-x={map.size[0] / 2}
                position-z={map.size[1] / 2}
            >
                <planeGeometry args={map.size} />
                <meshStandardMaterial color={"#f0f0f0"} />
            </mesh>

            {/* visualsed grid  size is  1 unit of three js coordinate*/}
            <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />

            {/* loading all items */}
            {(buildMode ? items : map.items).map((item, idx) => (
                <Item
                    key={`${item.name}-${idx}`}
                    item={item}
                    onClick={
                        // if there is already an item in dragged satate, 
                        //even we click new item, it still keep the previous item
                        () => {
                            if (buildMode) {
                                setDraggedItem((prev) => (prev === null ? idx : prev))
                                setDraggedItemRotation(item.rotation || 0)
                            }

                        }

                    }
                    isDragging={draggedItem === idx}
                    dragPosition={dragPosition}
                    dragRotation={draggedItemRotation}
                    canDrop={canDrop}
                />
            ))}


            {/* when mounting and not in the build mode
             create each characters based on the charactee list
            
            when in the build mode without character, the orbit control is enabled
             
              */}
            {!buildMode &&
                characters.map((character) => (
                    <AnimatedWoman
                        key={character.id}
                        id={character.id}
                        path={character.path}
                        position={gridToVector3(character.position)}
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