import React, { useEffect, useMemo, useRef, useState } from 'react'
import { io } from "socket.io-client"


export const socket = io("http://localhost:3001")
export const SocketManager = () => {
    useEffect(() => {
        function onConnect() {
            console.log("connected")
        }
        function onDisconnect() {
            console.log("disconnected")
        }
        function onHello() {
            console.log("hello")
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on('hello', onHello)

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off('hello', onHello)
        }

    }, [])
}