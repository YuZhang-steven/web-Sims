
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
    washer: {
        name: "washer",
        size: [2, 2],
    },
    toiletSquare: {
        name: "toiletSquare",
        size: [1, 2],
    },
    trashcan: {
        name: "trashcan",
        size: [1, 1],
    },
    bathroomCabinetDrawer: {
        name: "bathroomCabinetDrawer",
        size: [2, 2],
    },
    bathtub: {
        name: "bathtub",
        size: [4, 2],
    },
    bathroomMirror: {
        name: "bathroomMirror",
        size: [2, 1],
        wall: true,
    },
    bathroomCabinet: {
        name: "bathroomCabinet",
        size: [2, 1],
        wall: true,
    },
    bathroomSink: {
        name: "bathroomSink",
        size: [2, 2],
    },
    showerRound: {
        name: "showerRound",
        size: [2, 2],
    },
    tableCoffee: {
        name: "tableCoffee",
        size: [4, 2],
    },
    loungeSofaCorner: {
        name: "loungeSofaCorner",
        size: [5, 5],
    },
    bear: {
        name: "bear",
        size: [2, 1],
        wall: true,
    },
    loungeSofaOttoman: {
        name: "loungeSofaOttoman",
        size: [2, 2],
    },
    tableCoffeeGlassSquare: {
        name: "tableCoffeeGlassSquare",
        size: [2, 2],
    },
    loungeDesignSofaCorner: {
        name: "loungeDesignSofaCorner",
        size: [5, 5],
    },
    loungeDesignSofa: {
        name: "loungeDesignSofa",
        size: [5, 2],
    },
    loungeSofa: {
        name: "loungeSofa",
        size: [5, 2],
    },
    bookcaseOpenLow: {
        name: "bookcaseOpenLow",
        size: [2, 1],
    },
    kitchenBar: {
        name: "kitchenBar",
        size: [2, 1],
    },
    bookcaseClosedWide: {
        name: "bookcaseClosedWide",
        size: [3, 1],
    },
    bedSingle: {
        name: "bedSingle",
        size: [3, 5],
    },
    bench: {
        name: "bench",
        size: [2, 1],
    },
    bedDouble: {
        name: "bedDouble",
        size: [5, 5],
    },
    benchCushionLow: {
        name: "benchCushionLow",
        size: [2, 1],
    },
    loungeChair: {
        name: "loungeChair",
        size: [2, 2],
    },
    cabinetBedDrawer: {
        name: "cabinetBedDrawer",
        size: [1, 1],
    },
    cabinetBedDrawerTable: {
        name: "cabinetBedDrawerTable",
        size: [1, 1],
    },
    table: {
        name: "table",
        size: [4, 2],
    },
    tableCrossCloth: {
        name: "tableCrossCloth",
        size: [4, 2],
    },
    plant: {
        name: "plant",
        size: [1, 1],
    },
    plantSmall: {
        name: "plantSmall",
        size: [1, 1],
    },
    rugRounded: {
        name: "rugRounded",
        size: [6, 4],
        walkable: true,
    },
    rugRound: {
        name: "rugRound",
        size: [4, 4],
        walkable: true,
    },
    rugSquare: {
        name: "rugSquare",
        size: [4, 4],
        walkable: true,
    },
    rugRectangle: {
        name: "rugRectangle",
        size: [8, 4],
        walkable: true,
    },
    televisionVintage: {
        name: "televisionVintage",
        size: [4, 2],
    },
    televisionModern: {
        name: "televisionModern",
        size: [4, 2],
    },
    kitchenCabinetCornerRound: {
        name: "kitchenCabinetCornerRound",
        size: [2, 2],
    },
    kitchenCabinetCornerInner: {
        name: "kitchenCabinetCornerInner",
        size: [2, 2],
    },
    kitchenCabinet: {
        name: "kitchenCabinet",
        size: [2, 2],
    },
    kitchenBlender: {
        name: "kitchenBlender",
        size: [1, 1],
    },
    dryer: {
        name: "dryer",
        size: [2, 2],
    },
    chairCushion: {
        name: "chairCushion",
        size: [1, 1],
    },
    chair: {
        name: "chair",
        size: [1, 1],
    },
    deskComputer: {
        name: "deskComputer",
        size: [3, 2],
    },
    desk: {
        name: "desk",
        size: [3, 2],
    },
    chairModernCushion: {
        name: "chairModernCushion",
        size: [1, 1],
    },
    chairModernFrameCushion: {
        name: "chairModernFrameCushion",
        size: [1, 1],
    },
    kitchenMicrowave: {
        name: "kitchenMicrowave",
        size: [1, 1],
    },
    coatRackStanding: {
        name: "coatRackStanding",
        size: [1, 1],
    },
    kitchenSink: {
        name: "kitchenSink",
        size: [2, 2],
    },
    lampRoundFloor: {
        name: "lampRoundFloor",
        size: [1, 1],
    },
    lampRoundTable: {
        name: "lampRoundTable",
        size: [1, 1],
    },
    lampSquareFloor: {
        name: "lampSquareFloor",
        size: [1, 1],
    },
    lampSquareTable: {
        name: "lampSquareTable",
        size: [1, 1],
    },
    toaster: {
        name: "toaster",
        size: [1, 1],
    },
    kitchenStove: {
        name: "kitchenStove",
        size: [2, 2],
    },
    laptop: {
        name: "laptop",
        size: [1, 1],
    },
    radio: {
        name: "radio",
        size: [1, 1],
    },
    speaker: {
        name: "speaker",
        size: [1, 1],
    },
    speakerSmall: {
        name: "speakerSmall",
        size: [1, 1],
    },
    stoolBar: {
        name: "stoolBar",
        size: [1, 1],
    },
    stoolBarSquare: {
        name: "stoolBarSquare",
        size: [1, 1],
    },
};

/** map all the item and floor*/

const map = {
    size: [10, 10],
    gridDivision: 2,
    items: [
        {
            ...items.showerRound,
            gridPosition: [0, 0],
        },
        {
            ...items.toiletSquare,
            gridPosition: [0, 3],
            rotation: 1,
        },
        {
            ...items.washer,
            gridPosition: [5, 0],
        },
        {
            ...items.bathroomSink,
            gridPosition: [7, 0],
        },
        {
            ...items.trashcan,
            gridPosition: [0, 5],
            rotation: 1,
        },
        {
            ...items.bathroomCabinetDrawer,
            gridPosition: [3, 0],
        },
        {
            ...items.bathtub,
            gridPosition: [4, 4],
        },
        {
            ...items.bathtub,
            gridPosition: [0, 8],
            rotation: 3,
        },
        {
            ...items.bathroomCabinet,
            gridPosition: [3, 0],
        },
        {
            ...items.bathroomMirror,
            gridPosition: [0, 8],
            rotation: 1,
        },
        {
            ...items.bathroomMirror,
            gridPosition: [, 10],
            rotation: 1,
        },
        {
            ...items.tableCoffee,
            gridPosition: [10, 8],
        },
        {
            ...items.rugRectangle,
            gridPosition: [8, 7],
        },
        {
            ...items.loungeSofaCorner,
            gridPosition: [6, 10],
        },
        {
            ...items.bear,
            gridPosition: [0, 3],
            rotation: 1,
        },
        {
            ...items.plant,
            gridPosition: [11, 13],
        },
        {
            ...items.cabinetBedDrawerTable,
            gridPosition: [13, 19],
        },
        {
            ...items.cabinetBedDrawer,
            gridPosition: [19, 19],
        },
        {
            ...items.bedDouble,
            gridPosition: [14, 15],
        },
        {
            ...items.bookcaseClosedWide,
            gridPosition: [12, 0],
            rotation: 2,
        },
        {
            ...items.speaker,
            gridPosition: [11, 0],
        },
        {
            ...items.speakerSmall,
            gridPosition: [15, 0],
        },
        {
            ...items.loungeChair,
            gridPosition: [10, 4],
        },
        {
            ...items.loungeSofaOttoman,
            gridPosition: [14, 4],
        },
        {
            ...items.loungeDesignSofa,
            gridPosition: [18, 0],
            rotation: 1,
        },
        {
            ...items.kitchenCabinetCornerRound,
            gridPosition: [2, 18],
            rotation: 2,
        },
        {
            ...items.kitchenCabinetCornerInner,
            gridPosition: [0, 18],
            rotation: 2,
        },
        {
            ...items.kitchenStove,
            gridPosition: [0, 16],
            rotation: 1,
        },
        {
            ...items.dryer,
            gridPosition: [0, 14],
            rotation: 1,
        },
        {
            ...items.lampRoundFloor,
            gridPosition: [0, 12],
        },
    ],
};

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