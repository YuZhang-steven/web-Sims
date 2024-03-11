import { useAtom } from "jotai"



import { ContactShadows, Environment, Grid, useCursor, OrbitControls } from "@react-three/drei";
import { AnimatedWoman } from "./assets/AnimatedWoman";
import { charactersAtom, mapAtom, socket, userAtom } from "./components/SocketManager";
import { useEffect, useRef, useState } from "react";
import { Item } from "./components/item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "./hook/useGrid";
import { buildModeAtom, draggedItemAtom, draggedItemRotationAtom, shopModeAtom } from "./components/UI";


export function Experience() {



    /**
     * Global state(consume)
     * 
     * the state with setting functions, We will update the value in here.
     * the state withou setting functions, we will only get the value from here.
     */


    //change to build mode
    const [buildMode, setBuildMode] = useAtom(buildModeAtom)
    //change to shop mode
    const [shopMode, setShopMode] = useAtom(shopModeAtom)
    //1.check if we are dragging an item 2. store the id of the item
    const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom)
    //store the current dragged item's rotation
    const [draggedItemRotation, setDraggedItemRotation] = useAtom(draggedItemRotationAtom)
    //get the character list from the socket message
    const [characters] = useAtom(charactersAtom)
    //get the map information from the socket message, we don't directly change it in here.
    //all the change need to be call the server to update all the clients
    const [map] = useAtom(mapAtom)
    //retrieve current user id
    const [user] = useAtom(userAtom)

    /**
     * Local state
     */

    //current item position(current mouse position when dragging the item).Grid coordinate array [x, y ]
    const [dragPosition, setDragPosition] = useState(null)
    //check if the item can be dropped in the current location without the collision with other items
    const [canDrop, setCanDrop] = useState(false)
    //the whole scene(map) item list
    const [items, setItems] = useState(map.items)
    // set the effect that when cursor on specific situation, it become the hand pointer symbol
    const [onFoor, setOnFloor] = useState(false)

    /**
     * Hook
     * 
     * This hook gives you access to the state model which 
     * contains the default renderer, the scene, your camera, and so on.
     * It also gives you the current size of the canvas in screen and viewport coordinates.
     */

    //get the coordinate convert method from the useGrid hook
    const { vector3ToGrid, gridToVector3 } = useGrid()
    //change the cursor symbol when onFloor state is true
    useCursor(onFoor)
    //the reference point of current control
    const controls = useRef()
    //get the current state of the three js
    const state = useThree((state) => state)
    //get the current state of the three js
    const scene = useThree((state) => state.scene)

    /**
     * function hangle
     * 
     */

    /**
    * handle the character move
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
        /** if it is build mode, we drop the current item to the location on the plan*/
        else {
            //check if we alread have a item onDrage
            //if so, igonore other item click
            if (draggedItem !== null) {
                //if the item can can drop on current location, we update current item list
                if (canDrop) {
                    //pass the setItems function to the Items state
                    setItems((prev) => {
                        const newItems = [...prev]// find the location of the new item list
                        //find the object in the item list and update its position and rotation
                        newItems[draggedItem].gridPosition = vector3ToGrid(e.point)
                        newItems[draggedItem].rotation = draggedItemRotation
                        //return the location of the item list
                        return newItems//return only finish the setitem function, if will continue
                    })
                }
                //after dropped item, set drag state to null
                setDraggedItem(null)
            }
        }

    }

    /**
     * Effect handle
     */


    /**item drop locatin validation
     * excute this effect when item list(local), dragged postion(local) or draggedItem(global state) state change
     */

    /**CHECK :
     * 1. why Items list change need to excute this effec? 
     * 2. when drogging a object, postion condinue changgind, how does it validate the location dynamically?
     */
    useEffect(() => {
        //if we are not dragging a item,we don't care about update
        if (!draggedItem) {
            return
        }
        //retrive dragged item form item list based on id
        const item = items[draggedItem]
        //find and recalculate the size of the item
        const width = draggedItemRotation === 1 || draggedItemRotation === 3 ? item.size[1] : item.size[0]
        const height = draggedItemRotation === 1 || draggedItemRotation === 3 ? item.size[0] : item.size[1]

        //drap location validation tag
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

        //update the canDrop state based on the validation
        setCanDrop(droppable)


    }, [dragPosition, draggedItem, items, draggedItemRotation])

    /**
     * buildMode change effect
     */
    useEffect(() => {
        //when enter the build mode, reset the camara location to the origin
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
            <ambientLight intensity={0.1} />
            <directionalLight
                position={[-4, 4, -4]}
                castShadow
                intensity={0.35}
                shadow-mapSize={[1024, 1024]}

            >
                <orthographicCamera
                    attach={"shadow-camera"}
                    args={[-map.size[0], map.size[1], 10, -10]}
                    far={map.size[0] + map.size[1]}
                />
            </directionalLight>
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
            {!shopMode &&
                <mesh
                    rotation-x={-Math.PI / 2}
                    position-y={-0.001}
                    //when clicking, send the intersection point information to the server to update the characters.
                    onClick={onPlaneClicked}

                    //mouse hover, the mouse symbol change
                    onPointerEnter={() => setOnFloor(true)}
                    onPointerLeave={() => setOnFloor(false)}

                    onPointerMove={(e) => {
                        //The function only work in bulidng mode. if it is playing mode, we don't want to move forniture. 
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
                            //update the DragPosition statae(local), save the new drag position to the state:[x, y]
                            setDragPosition(newPosition)
                        }
                    }}

                    position-x={map.size[0] / 2}
                    position-z={map.size[1] / 2}
                    receiveShadow
                >
                    <planeGeometry args={map.size} />
                    <meshStandardMaterial color={"#f0f0f0"} />
                </mesh>}

            {/* visualsed grid  size is 1 unit of three js coordinate*/}
            {/*conditiontal rendering, only show grid in the build mode but not shop mode(when in the shop mode, we are in the build mode at the same time) */}
            {buildMode && !shopMode &&
                <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
            }


            {/* loading all items, in the building mode, we use current item list
            when leave the building mode, we retrieve the new list from global state
             */}
            {!shopMode && (buildMode ? items : map.items).map((item, idx) => (
                <Item
                    key={`${item.name}-${idx}`}
                    item={item}
                    // handling the selcect event in build Mode
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
                    //if the item is in dragging, update its local satate
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


        </>
    )
}