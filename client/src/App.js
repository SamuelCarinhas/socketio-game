import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import Game from './game';

let socket;
const CONNECTION_STRING = 'localhost:4001';

function App() {

  let [playerName, setPlayerName] = useState('');
  let [game, setGame] = useState(new Game(500, 500, 20));
  const canvasRef = useRef(null);

  const updateCanvas = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    Object.keys(game.players).map(playerN => {
      if(playerName === playerN) ctx.fillStyle = 'gold';
      else ctx.fillStyle = 'black';
      let player = game.players[playerN];
      ctx.fillRect(player.x, player.y, game.playerSize, game.playerSize);
      return playerN;
    })
  }

  useEffect(() => {
    socket = io(CONNECTION_STRING);
    socket.on('connect', () => {
      playerName = socket.id;
      setPlayerName(socket.id);
      socket.on('addPlayer', (command) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        game.addPlayer(command.args);
        updateCanvas(ctx);
      });
  
      socket.on('disconnectPlayer', (command) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        game.removePlayer(command.args);
        updateCanvas(ctx);
      })
  
      socket.on('setup', (config) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        for(let player of config.players) {
          game.addPlayer(player);
        }
        updateCanvas(ctx);
      });

      socket.on('updatePlayer', (command) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        game.updatePlayer(command.args.playerName, command.args.x, command.args.y);
        updateCanvas(ctx);
      })
    })

  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const movement = (e) => {
      let player = game.getPlayer(playerName);
      if(e.keyCode === 37) { // LEFT
        game.updatePlayer(playerName, Math.max(0, player.x - game.playerSize), player.y);
      }
      if(e.keyCode === 38) { // UP
        game.updatePlayer(playerName, player.x, Math.max(0, player.y - game.playerSize));
      }
      if(e.keyCode === 39) { // RIGHT
        game.updatePlayer(playerName, Math.min(game.width - game.playerSize, player.x + game.playerSize), player.y);
      }
      if(e.keyCode === 40) { // DOWN
        game.updatePlayer(playerName, player.x, Math.min(game.height - game.playerSize, player.y + game.playerSize));
      }
      socket.emit('updatePlayer', game.getPlayer(playerName));
      updateCanvas(ctx);
    }

    window.addEventListener('keydown', movement);

    updateCanvas(ctx);

    return () => {
      window.removeEventListener('keydown', movement);
    }
  }, [game, playerName]);

  return (
    <div className="main">
      <canvas width={game.width} height={game.height} className="gameCavas" ref={canvasRef} />
    </div>
  );
}

export default App;
