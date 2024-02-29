/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/models/AnimatedWoman.glb -o src/assets/AnimatedWoman.jsx -r public 
*/

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame, useGraph } from '@react-three/fiber'
import { SkeletonUtils } from "three-stdlib"
import { useAtom } from 'jotai'
import { userAtom } from '../components/SocketManager'

/**
 * basic varible
 */
const MOVEMENT_SPEED = 0.032//character move speed

/**
 * 
 * @param {
 * hair color 
 * top color 
 * bottom color
 * } param0 
 * @returns 
 * An woman chracters
 */
export function AnimatedWoman({
  hairColor = "green",
  topColor = "pink",
  bottomColor = "brown",
  id,
  ...props
}) {

  //initial location
  const position = useMemo(() => props.position, [])
  // reference point
  const group = useRef()
  //get data from GLTF, notice we export scene not node
  const { scene, materials, animations } = useGLTF('/models/AnimatedWoman.glb')

  //clone the skinnedmesh
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

  //from useGraph to get final clone result
  const { nodes } = useGraph(clone)

  //get animation from the GLTf and then add them through reference
  const { actions } = useAnimations(animations, group)
  //switch from different animations
  const [animation, setAnimation] = useState("CharacterArmature|Idle")


  /**
   * Setting up the aimation with useEffect
   * 
   * The animation has to run from start to the end of component, the rerender not affect it
   * the only thing cause it update is the animation it self change. so we use useEffect to
   * achive it
   */
  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation])


  const [user] = useAtom(userAtom)

  /**
   * state lisnener during each frame
   */
  useFrame((state) => {

    /**
     * Cheack if the current position is different with character list position.
     * if so calculate move direction and step and moving in every frame.
     * eles keep the character in the idle
     */
    if (group.current.position.distanceTo(props.position) > 0.1) {
      //direction is the step in each frame. the movement_speed determine the step size
      const direction = group.current.position
        .clone()
        .sub(props.position)
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED)
      group.current.position.sub(direction)//change position to next position
      group.current.lookAt(props.position)// change looking direction
      setAnimation("CharacterArmature|Run")
    }
    else {
      setAnimation("CharacterArmature|Idle")
    }

    /**
     * 
     */
    if (id === user) {
      state.camera.position.x = group.current.position.x + 8
      state.camera.position.y = group.current.position.y + 8
      state.camera.position.z = group.current.position.z + 8
      state.camera.lookAt(group.current.position)
    }

  })

  return (
    <group
      ref={group}
      {...props}
      position={position}
      dispose={null}
      name={`character-${id}`}
    >
      <group name="Root_Scene">
        <group name="RootNode">
          <group name="CharacterArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Root} />
          </group>
          <group name="Casual_Body" rotation={[-Math.PI / 2, 0, 0]} scale={100}>

            <skinnedMesh
              name="Casual_Body_1"
              geometry={nodes.Casual_Body_1.geometry}
              material={materials.White}
              skeleton={nodes.Casual_Body_1.skeleton}
            >
              {/* change material and set the color */}
              <meshStandardMaterial color={topColor} />
            </skinnedMesh>

            <skinnedMesh
              name="Casual_Body_2"
              geometry={nodes.Casual_Body_2.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Body_2.skeleton}

            />
          </group>
          <group name="Casual_Feet" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh name="Casual_Feet_1" geometry={nodes.Casual_Feet_1.geometry} material={materials.Skin} skeleton={nodes.Casual_Feet_1.skeleton} />
            <skinnedMesh name="Casual_Feet_2" geometry={nodes.Casual_Feet_2.geometry} material={materials.Grey} skeleton={nodes.Casual_Feet_2.skeleton} />
          </group>
          <group name="Casual_Head" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh
              name="Casual_Head_1"
              geometry={nodes.Casual_Head_1.geometry}
              material={materials.Skin}
              skeleton={nodes.Casual_Head_1.skeleton}
            />

            <skinnedMesh
              name="Casual_Head_2"
              geometry={nodes.Casual_Head_2.geometry}
              material={materials.Hair_Blond}
              skeleton={nodes.Casual_Head_2.skeleton}
            >
              {/* change material and set the color */}
              <meshStandardMaterial color={hairColor} />
            </skinnedMesh>

            <skinnedMesh
              name="Casual_Head_3"
              geometry={nodes.Casual_Head_3.geometry}
              material={materials.Hair_Brown}
              skeleton={nodes.Casual_Head_3.skeleton}
            />

            <skinnedMesh
              name="Casual_Head_4"
              geometry={nodes.Casual_Head_4.geometry}
              material={materials.Brown}
              skeleton={nodes.Casual_Head_4.skeleton}
            />

          </group>
          <skinnedMesh
            name="Casual_Legs"
            geometry={nodes.Casual_Legs.geometry}
            material={materials.Orange}
            skeleton={nodes.Casual_Legs.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            {/* change material and set the color */}
            <meshStandardMaterial color={bottomColor} />
          </skinnedMesh>



        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/AnimatedWoman.glb')
