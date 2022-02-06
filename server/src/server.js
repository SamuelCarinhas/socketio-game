import { createServer } from 'http';
import { Server } from 'socket.io';
import Game from './game.js';

const SERVER_PORT = 4001;
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

let game = new Game();
game.subscribe((command) => {
    console.log(`Broadcast: ${command.type}`)
    io.sockets.emit(command.type, command);
})

io.on('connection', (socket) => {
    console.log(`Player ${socket.id} connected`);
    
    game.addPlayer(socket.id);
    
    socket.emit('setup', {
        players: game.getRemainingPlayers(socket.id)
    });

    socket.on('updatePlayer', (player) => {
        game.updatePlayer(player.playerName, player.x, player.y);
    })

    socket.on('disconnect', () => {
        console.log(`Player ${socket.id} disconnected`);
        game.disconnectPlayer(socket.id);
    });
});

httpServer.listen(SERVER_PORT, () => {
    console.log(`Server listening on port: ${SERVER_PORT}`)
})
