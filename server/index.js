
import { Server } from "socket.io";
/**
 * initialize server
 */
// create new server in the local, same as client side 5173
const io = new Server({
    cors: {
        origin: "http://localhost:5173"
    }
})

// the port the server listen to
io.listen(3001);

/**
 * Global data
 */
// the User(character list)
const characters = []

/**
 * item dictionary
 */
const items = {
    table: {
        name: 'tableRoundL',
        size: [6, 2],
    },
    chair: {
        name: "chair1",
        size: [1, 1]
    },
    couch: {
        name: "couchsmall1",
        size: [3, 3]
    },
    sofa: {
        name: "couchLarge1",
        size: [7, 3]
    },
}

/** map all the item and floor*/

const map = {
    size: [10, 10],
    gridDivision: 2,
    items: [
        {
            ...items.chair,
            gridPosition: [12, 16],
            rotation: 3
        },
        {
            ...items.chair,
            gridPosition: [8, 16],
            rotation: 1
        },
        {
            ...items.table,
            gridPosition: [8, 14],
            rotation: 1
        },
        {
            ...items.couch,
            gridPosition: [9, 6],
            rotation: 1
        },
        {

            ...items.sofa,
            gridPosition: [12, 2],
            rotation: 0
        },
    ]
}

/**
 * 
 * Helper function
 */

//generate random 2D position
const generateRandomPosition = () => {
    return [Math.random() * map.size[0], 0, Math.random() * map.size[0]]
}

//generate random hex color
const generateRandomHexColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

/**
 * server event handle
 */

io.on("connection", (socket) => {
    //show when user first connected(open the new tab)
    console.log("user connected")

    //set up the character profile and add to the array
    characters.push({
        id: socket.id,
        position: generateRandomPosition(),
        hairColor: generateRandomHexColor(),
        topColor: generateRandomHexColor(),
        bottomColor: generateRandomHexColor(),
    })

    //everytime a new socket connected, send this event massage to the one new connected
    //send back message to sender only
    socket.emit("hello", //the first part is the string for eventName
        {
            map,
            characters,
            id: socket.id,
            items,
        })

    //server send the messages to all connacted clients: include the new characters array
    io.emit("characters", characters);


    //set a event listener: 
    //listen to event "move" and get the arg, move location.
    //look the whole array and find the id matched character, then change its'position
    //finally send the new character list back to every clients
    socket.on("move", (position) => {
        const character = characters.find((character) => character.id === socket.id)
        character.position = position
        io.emit("characters", characters)

    })


    //"disconnect event listener"
    socket.on("disconnect", () => {
        //show message on the server side
        console.log("user disconnected")

        //find the characers in the charater list and rid it out
        characters.splice(
            characters.findIndex((characters) => character.id === socket.id),
            1
        )
        //send the new character list to all the clients
        io.emit("characters", characters);
    })
})