import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import './ShooterGame.css';

const ShooterGame = () => {
  const canvasRef = useRef(null);
  const [gameMode, setGameMode] = useState('menu'); // menu, bot, online, private
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [roomId, setRoomId] = useState('');
  const { socket } = useSocket();

  useEffect(() => {
    if (gameMode !== 'menu') {
      initGame();
    }
  }, [gameMode]);

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 700;

    // Game state
    const gameState = {
      player: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 20,
        speed: 5,
        angle: 0,
        health: 100,
        color: '#00ffff'
      },
      bullets: [],
      enemies: [],
      particles: []
    };

    // Input handling
    const keys = {};
    let mouseX = 0;
    let mouseY = 0;

    const handleKeyDown = (e) => {
      keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseClick = () => {
      shootBullet();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    // Spawn enemies (for bot mode)
    const spawnEnemy = () => {
      if (gameMode === 'bot') {
        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
          case 0: // top
            x = Math.random() * canvas.width;
            y = -20;
            break;
          case 1: // right
            x = canvas.width + 20;
            y = Math.random() * canvas.height;
            break;
          case 2: // bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 20;
            break;
          case 3: // left
            x = -20;
            y = Math.random() * canvas.height;
            break;
        }

        gameState.enemies.push({
          x,
          y,
          size: 20,
          speed: 2,
          health: 50,
          color: '#ff3366'
        });
      }
    };

    const enemySpawnInterval = setInterval(spawnEnemy, 2000);

    // Shoot bullet
    const shootBullet = () => {
      const angle = Math.atan2(
        mouseY - gameState.player.y,
        mouseX - gameState.player.x
      );

      gameState.bullets.push({
        x: gameState.player.x,
        y: gameState.player.y,
        vx: Math.cos(angle) * 10,
        vy: Math.sin(angle) * 10,
        size: 5,
        color: '#ffff00'
      });
    };

    // Create particle effect
    const createParticles = (x, y, color, count = 10) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        gameState.particles.push({
          x,
          y,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          size: 3,
          color,
          life: 30
        });
      }
    };

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Update player position
      if (keys['w'] || keys['ArrowUp']) gameState.player.y -= gameState.player.speed;
      if (keys['s'] || keys['ArrowDown']) gameState.player.y += gameState.player.speed;
      if (keys['a'] || keys['ArrowLeft']) gameState.player.x -= gameState.player.speed;
      if (keys['d'] || keys['ArrowRight']) gameState.player.x += gameState.player.speed;

      // Keep player in bounds
      gameState.player.x = Math.max(20, Math.min(canvas.width - 20, gameState.player.x));
      gameState.player.y = Math.max(20, Math.min(canvas.height - 20, gameState.player.y));

      // Update player angle
      gameState.player.angle = Math.atan2(
        mouseY - gameState.player.y,
        mouseX - gameState.player.x
      );

      // Draw player
      ctx.save();
      ctx.translate(gameState.player.x, gameState.player.y);
      ctx.rotate(gameState.player.angle);
      ctx.fillStyle = gameState.player.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = gameState.player.color;
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-15, -10);
      ctx.lineTo(-15, 10);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Update and draw bullets
      gameState.bullets = gameState.bullets.filter(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        // Remove if out of bounds
        if (bullet.x < 0 || bullet.x > canvas.width || 
            bullet.y < 0 || bullet.y > canvas.height) {
          return false;
        }

        // Draw bullet
        ctx.fillStyle = bullet.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Update and draw enemies
      gameState.enemies = gameState.enemies.filter(enemy => {
        // Move towards player
        const dx = gameState.player.x - enemy.x;
        const dy = gameState.player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
          enemy.x += (dx / dist) * enemy.speed;
          enemy.y += (dy / dist) * enemy.speed;
        }

        // Check collision with bullets
        for (let i = gameState.bullets.length - 1; i >= 0; i--) {
          const bullet = gameState.bullets[i];
          const bDist = Math.sqrt(
            Math.pow(bullet.x - enemy.x, 2) + 
            Math.pow(bullet.y - enemy.y, 2)
          );

          if (bDist < enemy.size) {
            enemy.health -= 50;
            gameState.bullets.splice(i, 1);
            createParticles(enemy.x, enemy.y, enemy.color);

            if (enemy.health <= 0) {
              setKills(k => k + 1);
              setScore(s => s + 100);
              createParticles(enemy.x, enemy.y, enemy.color, 20);
              return false;
            }
          }
        }

        // Check collision with player
        const pDist = Math.sqrt(
          Math.pow(gameState.player.x - enemy.x, 2) + 
          Math.pow(gameState.player.y - enemy.y, 2)
        );

        if (pDist < gameState.player.size + enemy.size) {
          gameState.player.health -= 10;
          createParticles(enemy.x, enemy.y, enemy.color);
          
          if (gameState.player.health <= 0) {
            setDeaths(d => d + 1);
            gameState.player.health = 100;
          }
          
          return false;
        }

        // Draw enemy
        ctx.fillStyle = enemy.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Update and draw particles
      gameState.particles = gameState.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        return particle.life > 0;
      });

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Cleanup
    return () => {
      clearInterval(enemySpawnInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  };

  const startBotMode = () => {
    setGameMode('bot');
    setScore(0);
    setKills(0);
    setDeaths(0);
  };

  const createPrivateRoom = () => {
    const newRoomId = 'room_' + Math.random().toString(36).substr(2, 9);
    setRoomId(newRoomId);
    if (socket) {
      socket.emit('game:createRoom', {
        gameId: 'shooter',
        roomId: newRoomId,
        maxPlayers: 4
      });
    }
    setGameMode('private');
  };

  return (
    <div className="shooter-game">
      <div className="game-header glass">
        <Link to="/dashboard" className="back-btn">← Back</Link>
        <h1 className="neon-text">Battle Royale Shooter</h1>
        <div className="game-stats">
          <span>Score: {score}</span>
          <span>Kills: {kills}</span>
          <span>Deaths: {deaths}</span>
        </div>
      </div>

      {gameMode === 'menu' ? (
        <div className="game-menu glass-intense">
          <h2>Select Game Mode</h2>
          <div className="mode-buttons">
            <button onClick={startBotMode} className="btn btn-primary">
              🤖 Bot Mode
            </button>
            <button className="btn btn-primary">
              🌐 Online Matchmaking
            </button>
            <button onClick={createPrivateRoom} className="btn btn-primary">
              🔒 Private Room
            </button>
          </div>
          {roomId && (
            <div className="room-info">
              <p>Room ID: <strong>{roomId}</strong></p>
              <p>Share this ID with friends to join!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="game-canvas-container">
          <canvas ref={canvasRef} className="game-canvas" />
          <div className="game-controls glass">
            <p>WASD / Arrow Keys - Move</p>
            <p>Mouse - Aim & Shoot</p>
            <button onClick={() => setGameMode('menu')} className="btn btn-secondary">
              Exit Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShooterGame;
