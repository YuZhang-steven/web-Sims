import { useEffect } from 'react'
import { io } from "socket.io-client"
import { useAtom, atom } from "jotai"

//create a new manager on this url(port3001). return a new socket
// this socket has to be able to exported(globally), because we will call it in other components
export const socket = io("http://localhost:3001")

/*
create a global state store:
Characters:which it is an array to sync the character list with server
map: the basic map information and item information
user: the user id(socket generated id) list
*/
export const charactersAtom = atom([])
export const mapAtom = atom(null)
export const userAtom = atom(null)
export const itemsAtom = atom(null)




/**
 * Major socketManager component
 */
export const SocketManager = () => {
    //use gloabal state

    //underscore means, the characters should be a private variables
    const [characters, setCharacters] = useAtom(charactersAtom)
    const [map, setMap] = useAtom(mapAtom)
    const [user, setUser] = useAtom(userAtom)
    const [items, setItems] = useAtom(itemsAtom)

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
        //get initial information from server
        function onHello(value) {

            //store the information to the global state
            setMap(value.map)// store map and item information 
            setUser(value.id)//socket generated id
            setCharacters(value.characters)//character list
            setItems(value.items)//the item in here not include the location on the specific map


        }

        //This function is the only function with args,
        //used to update the client character list with new character list 
        //because on Index.js, it it the only emit message with name and value.
        function onCharacters(value) {
            setCharacters(value)
        }


        //call when player move. return the character need to update
        function onPlayerMove(value) {
            setCharacters((prev) => {
                return prev.map((character) => {
                    if (character.id === value.id) {
                        return value
                    }
                    return character
                })

            })
        }

        //up date user/map/characters all information at the same time
        function onMapUpdate(value) {

            setMap(value.map)
            setUser(value.id)
            setCharacters(value.characters)
        }

        //set up the listener to different events
        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on('hello', onHello)
        socket.on("characters", onCharacters)
        socket.on('playerMove', onPlayerMove)
        socket.on("mapUpdate", onMapUpdate)


        //functions will excute after the component dismount
        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off('hello', onHello)
            socket.off("characters", onCharacters)
            socket.off('playerMove', onPlayerMove)
            socket.off("mapUpdate", onMapUpdate)

        }

    }, [])
}