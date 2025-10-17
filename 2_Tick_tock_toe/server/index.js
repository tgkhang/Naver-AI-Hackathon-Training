const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const server = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server is running on ws://localhost:8080');

const rooms = {}; // roomId -> [ws1, ws2] object to hold players in each room
let roomId = 0; // Counter for room IDs

server.on('connection', (ws) => { // when a new client connects
  console.log('New player connected');

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    const { type, data } = JSON.parse(message);

    switch (type) {
      case 'join':
        // Handle player joining a room
        // Check if current room is full (2 players)

        break;

      case 'move':
        // Handle player making a move

        break;

      default:
        console.log('Unknown message type:', type);
    }
  });

});