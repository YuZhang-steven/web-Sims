import { useEffect } from 'react'
import { io } from "socket.io-client"
import { useAtom, atom } from "jotai"

//create a new manager on this url(port3001). return a new socket
// this socket has to be able to exported(globally), because we will call it in other components
export const socket = io("http://localhost:3001")

//create a global state store: Characters, which it is an array to sync the character list with server
export const charactersAtom = atom([])

/**
 * Major socketManager component
 */
export const SocketManager = () => {
    //create a global state and send previus store in it
    //underscore means, the characters should be a private variables
    const [characters, setCharacters] = useAtom(charactersAtom)

    /** UseEffect without dependency, only run once on initial mount.
     * it set up the listener to different events and turn off those listeners when component unmount
     * 
     */
    useEffect(() => {
        /**
         * the basic handle functions. 
         * we put them inside useeffect, because it only be used inside the useEffect
         */
        function onConnect() {
            console.log("connected")
        }
        function onDisconnect() {
            console.log("disconnected")
        }
        function onHello() {
            console.log("hello")
        }

        //This function is the only function with args,
        //because on Index.js, it it the only emit message with name and value.
        function onCharacters(value) {
            setCharacters(value)
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on('hello', onHello)
        socket.on("characters", onCharacters)

        //functions will excute after the component dismount
        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off('hello', onHello)
            socket.off("characters", onCharacters)

        }

    }, [])
}