import {websocket} from "../store/websocket.js"

let url = "ws://127.0.0.1:8004/ws";

interface socket {
      websocket: any
      init: () => any
      send: (e) => any
}

const socket: socket = {
    websocket: null,
    init: () => {
        socket.websocket = new WebSocket(url);
        socket.websocket.onmessage = (e: any) => {
            console.log(e)
        }
        socket.websocket.onclose = (e: any) => {
            console.log(e)
        }
    },
    send: (e) => {
        if(socket.websocket.readyState == 0) {
            setTimeout(() => {
                socket.websocket.send(JSON.stringify(e))
                // socket.websocket.send(e)
            }, 1000)
        } else {
            socket.websocket.send(JSON.stringify(e))
            // socket.websocket.send(e)
        }
    }
}

export default socket