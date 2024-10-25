let readyPlayerCount = 0;

const gameState = {
  rooms: [],
};

function playerAndGameReady(players, gameReady) {
  return players.length === 2 && gameReady && players.every((player) => player.status);
}

function removePlayer(players, id) {
  players.length;
  if (players.length > 1) {
    const disconnectedPlayer = players.findIndex((player) => player.id === id);
    players.splice(disconnectedPlayer, 1);
    return;
  }
  players.length = 0;
}

function updateRemainingPlayer(players) {
  players[0].status = false;
}
function updatePlayerStatus(players, id, status) {
  players.forEach((player) => {
    if (player.id === id) {
      player.status = status;
    }
  });
}
function listen(io) {
  const pongNamespace = io.of('/pong');
  let roomNumber = 0;
  pongNamespace.on('connection', (socket) => {
    let room;
    // let roomNamePreFix;
    console.log('a user connected', socket.id);

    socket.on('ready', (playerStatus, gameReady) => {
      roomNumber = Math.floor(readyPlayerCount / 2);
      roomNamePreFix = `room`;

      // console.log(' check ', gameState.rooms.length === roomNumber, roomNumber === 0 && gameState.rooms.length === 0);

      const notARoom = gameState.rooms.length === roomNumber || (roomNumber === 0 && gameState.rooms.length === 0);
      // console.log('roomNumber', roomNumber, 'notARoom', notARoom);

      if (notARoom) {
        // console.log('push room', gameState.rooms);
        newRoom = {
          [roomNumber]: {
            players: [],
          },
        };
        gameState.rooms.push(newRoom);

        // console.log('Game Room State:', gameState.rooms[roomNumber]);
      }
      room = gameState.rooms[roomNumber];
      socket.join(room);

      if (room[roomNumber].players.length) {
        let player1 = { id: socket.id, status: playerStatus };
        room[roomNumber].players.push(player1);
      } else {
        let player2 = { id: socket.id, status: playerStatus };
        room[roomNumber].players.push(player2);
      }

      console.log(
        'Player ready:',
        socket.id,
        'added to:',
        Object.keys(room).join('. '),
        'pongNamespace size:',
        pongNamespace.adapter.rooms.size,
        'players in room:',
        room[roomNumber].players,
      );

      readyPlayerCount++;

      console.log('playerAndGameReady:', playerAndGameReady(room[roomNumber].players, gameReady));
      // debugger;
      if (playerAndGameReady(room[roomNumber].players, gameReady)) {
        console.log('Starting Game ...');
        pongNamespace.in(room).emit('startGame', socket.id);
      }
      socket.on('playerStatus', ({ gameReady, playerStatus, id }) => {
        debugger;
        updatePlayerStatus(room[roomNumber].players, id, playerStatus);
        if (playerAndGameReady(room[roomNumber].players, gameReady)) {
          console.log('Starting Game ...');
          pongNamespace.in(room).emit('startGame', socket.id);
        }
      });
    });

    socket.on('paddleMove', (paddleData) => {
      socket.to(room).emit('paddleMove', paddleData);
    });

    socket.on('ballMove', (ballData) => {
      socket.to(room).emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      // debugger;
      // console.log(`removing player ${socket.id} from room`);
      removePlayer(room[roomNumber].players, socket.id);
      readyPlayerCount--;
      // console.log('Remaining player', room[roomNumber].players);
      if (room[roomNumber].players.length === 1) {
        updateRemainingPlayer(room[roomNumber].players, false);
        console.log('Updated remaining player', room[roomNumber].players);
        pongNamespace.to(room).emit('endGame');
        // console.log('endGame sent');
      }
      if (room[roomNumber].players.length === 0) {
        delete room;
        // console.log(`Room ${room} cleared`);
      }
      console.log('updatedPlayers', room[roomNumber].players);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen,
};
