const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const server = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server is running on ws://localhost:8080');

const rooms = {}; // roomId -> { players: [ws1, ws2], board: [], currentPlayer: 'X', playerSymbols: {} }
let roomIdCounter = 0; // Counter for room IDs
let waitingRoom = null; // Store waiting player


function sendMessage(ws, type, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, data }))
  }
}

function checkWinner(board) {

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a], line: combination
      }
    }
  }

  return null
}

function isDraw(board) {
  return board.every(cell => cell !== null) && !checkWinner(board);
}

function broadcastToRoom(roomId, type, data) {
  const room = rooms[roomId];
  if (room) {
    room.players.forEach(player => {
      sendMessage(player.ws, type, data);
    });
  }
}

server.on('connection', (ws) => { // when a new client connects
  console.log('New player connected');
  ws.roomId = null;
  ws.playerId = null;

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    const { type, data } = JSON.parse(message);

    switch (type) {
      case 'join':
        // Handle player joining a room
        if (waitingRoom && waitingRoom.players.length === 1) {
          // Join existing waiting room
          const room = waitingRoom;
          const roomId = room.roomId;

          room.players.push({ ws, symbol: 'O' });
          ws.roomId = roomId;
          ws.playerId = 1;

          // Clear waiting room
          waitingRoom = null;

          // Notify both players that game is starting
          sendMessage(room.players[0].ws, 'gameStart', {
            roomId,
            playerSymbol: 'X',
            opponentSymbol: 'O',
            isYourTurn: true,
            message: 'Game started! You are X (go first)'
          });

          sendMessage(room.players[1].ws, 'gameStart', {
            roomId,
            playerSymbol: 'O',
            opponentSymbol: 'X',
            isYourTurn: false,
            message: 'Game started! You are O (wait for opponent)'
          });

          console.log(`Room ${roomId} is now full. Game starting!`);
        }
        else {
          // Create a new room
          const roomId = roomIdCounter++;
          const newRoom = {
            roomId,
            players: [{ ws, symbol: 'X' }],
            board: Array(9).fill(null),
            currentPlayer: 'X',
          }

          rooms[roomId] = newRoom;
          waitingRoom = newRoom;
          ws.roomId = roomId
          ws.playerId = 0;

          sendMessage(ws, 'waiting', {
            roomId,
            message: 'Waiting for opponent to join...'
          })
          console.log(`Player created room ${roomId}, waiting for opponent`)
        }
        break;

      case 'move':
        // Handle player making a move
        const { position } = data
        const roomId = ws.roomId
        const room = rooms[roomId]

        if (!room) {
          sendMessage(ws, 'error', { message: 'Room not found' })
          break
        }

        // Verify it's this player's turn
        const playerSymbol = room.players[ws.playerId].symbol;
        if (room.currentPlayer !== playerSymbol) {
          sendMessage(ws, 'error', { message: 'Not your turn' });
          break;
        }

        // Verify position is valid
        if (room.board[position] !== null) {
          sendMessage(ws, 'error', { message: 'Cell already occupied' });
          break;
        }

        // Make the move
        room.board[position] = playerSymbol;

        const winner = checkWinner(room.board);
        const draw = isDraw(room.board);

        if (winner) {
          broadcastToRoom(roomId, 'gameOver', {
            board: room.board,
            winner: winner.winner,
            winningLine: winner.line,
            message: `${winner.winner} wins!`
          });
        } else if (draw) {

          broadcastToRoom(roomId, 'gameOver', {
            board: room.board,
            winner: null,
            message: "It's a draw!"
          });

        } else {
          // Continue game - switch turns
          room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
          broadcastToRoom(roomId, 'moveMade', {
            board: room.board,
            position,
            player: playerSymbol,
            currentPlayer: room.currentPlayer
          });
        }
        break;

      default:
        console.log('Unknown message type:', type);
    }
  });

  // Handle player disconnect
  ws.on('close', () => {
    console.log('Player disconnected');

    const roomId = ws.roomId;
    const room = rooms[roomId];

    if (room) {
      // Find the other player
      const otherPlayer = room.players.find(p => p.ws !== ws);

      if (otherPlayer) {
        // Notify the other player that opponent disconnected
        sendMessage(otherPlayer.ws, 'opponentDisconnected', {
          message: 'Opponent disconnected. You win!'
        });
      }

      // Clean up the room
      delete rooms[roomId];

      // If this was the waiting room, clear it
      if (waitingRoom && waitingRoom.roomId === roomId) {
        waitingRoom = null;
      }

      console.log(`Room ${roomId} deleted due to player disconnect`);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});