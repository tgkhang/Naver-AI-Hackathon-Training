const WebSocket = require('ws');

// create a WebSocket server on port 8081
const server = new WebSocket.Server({ port: 8081 });
console.log('WebSocket server created on ws://localhost:8081');

const rooms = {}; // roomId -> [ws1, ws2] object to hold players in each room
let roomId = 0; // Counter for room IDs

server.on('connection', (ws) => { // when a client connects
    console.log('Client connected');

    // handle incoming messages from clients
    ws.on('message', (msg) => {
        const { type, data } = JSON.parse(msg);

        switch (type) {
            case 'prepare':
                // Check if current room is full (2 players)
                if (rooms[roomId]?.length === 2) {
                    roomId++; // move to next room
                }

                // Add player to room
                if (rooms[roomId]) {
                    rooms[roomId].push(ws); // add to existing room
                } else {
                    rooms[roomId] = [ws]; // create new room
                }

                const playerSymbol = rooms[roomId].length === 1 ? 'X' : 'O';

                // Send start message to the player
                ws.send(JSON.stringify({
                    type: 'start',
                    data: {
                        player: playerSymbol,
                        roomId,
                    },
                }));
                break;
            // Handle player moves
            case 'move':
                const currentRoomId = data.roomId;
                rooms[currentRoomId]?.forEach((socket) => {
                    socket.send(JSON.stringify({
                        type: 'display',
                        data,
                    }));
                });
                break;
            default:
                break;
        }
    });

});