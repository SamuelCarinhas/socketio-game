import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import Game from './game';

function App() {

  let playerName = 'ColdAtom';
  let game = new Game(500, 500, 20);
  const canvasRef = useRef(null);

  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'gold';
    Object.keys(game.players).map(playerName => {
      let player = game.players[playerName];
      ctx.fillRect(player.x, player.y, game.playerSize, game.playerSize);
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const movement = (e) => {
      let player = game.getPlayer(playerName);
      if(e.keyCode === 37) { // LEFT
        game.updatePlayer(playerName, Math.max(0, player.x - game.playerSize), player.y);
      } else if(e.keyCode === 38) { // UP
        game.updatePlayer(playerName, player.x, Math.max(0, player.y - game.playerSize));
      } else if(e.keyCode === 39) { // RIGHT
        game.updatePlayer(playerName, Math.min(ctx.canvas.width - game.playerSize, player.x + game.playerSize), player.y);
      } else if(e.keyCode === 40) { // DOWN
        game.updatePlayer(playerName, player.x, Math.min(ctx.canvas.height - game.playerSize, player.y + game.playerSize));
      }
      draw(ctx);
    }

    window.addEventListener('keydown', movement);

    draw(ctx);

    return () => {
      window.removeEventListener('keydown', movement);
    }
  }, [draw]);

  return (
    <div className="main">
      <canvas width={game.width} height={game.height} className="gameCavas" ref={canvasRef} />
    </div>
  );
}

export default App;
