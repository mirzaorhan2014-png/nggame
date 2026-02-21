import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socketService from '../utils/socket';
import { leaderboardAPI } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import './ShooterGame.css';

const ShooterGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const canvasRef = useRef(null);
  const [gameMode, setGameMode] = useState(null); // 'bot', 'online', 'private'
  const [gameState, setGameState] = useState('menu'); // 'menu', 'matchmaking', 'playing', 'ended'
  const [score, setScore] = useState(0);
  const [roomId, setRoomId] = useState(null);
  const [shareableLink, setShareableLink] = useState('');

  // Game objects
  const gameObjects = useRef({
    player: { x: 400, y: 550, width: 40, height: 40, speed: 5, health: 100 },
    enemies: [],
    bullets: [],
    particles: [],
    keys: {}
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let lastTime = Date.now();

    // Game loop
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      update(deltaTime);
      render(ctx);

      animationId = requestAnimationFrame(gameLoop);
    };

    // Update game state
    const update = (deltaTime) => {
      if (gameState !== 'playing') return;

      const { player, enemies, bullets, particles, keys } = gameObjects.current;

      // Update player movement
      if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
      if (keys['ArrowRight'] && player.x < 760) player.x += player.speed;
      if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
      if (keys['ArrowDown'] && player.y < 560) player.y += player.speed;

      // Update bullets
      bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
      });

      // Update enemies (for bot mode)
      if (gameMode === 'bot') {
        enemies.forEach((enemy, index) => {
          enemy.y += enemy.speed;
          if (enemy.y > 600) {
            enemies.splice(index, 1);
            enemies.push(createEnemy());
          }

          // Check collision with bullets
          bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
              bullets.splice(bulletIndex, 1);
              enemies.splice(index, 1);
              enemies.push(createEnemy());
              setScore(s => s + 10);
              createParticles(enemy.x, enemy.y);
            }
          });

          // Check collision with player
          if (checkCollision(player, enemy)) {
            player.health -= 10;
            enemies.splice(index, 1);
            enemies.push(createEnemy());
            if (player.health <= 0) {
              endGame();
            }
          }
        });
      }

      // Update particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= deltaTime;
        if (particle.life <= 0) particles.splice(index, 1);
      });
    };

    // Render game
    const render = (ctx) => {
      // Clear canvas
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, 800, 600);

      // Draw stars background
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(Math.random() * 800, Math.random() * 600, 2, 2);
      }

      if (gameState === 'playing') {
        const { player, enemies, bullets, particles } = gameObjects.current;

        // Draw player
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f0ff';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.shadowBlur = 0;

        // Draw health bar
        ctx.fillStyle = '#ff3366';
        ctx.fillRect(10, 10, player.health * 2, 10);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(10, 10, 200, 10);

        // Draw score
        ctx.fillStyle = '#00ff88';
        ctx.font = '24px Arial';
        ctx.fillText(`Score: ${score}`, 10, 50);

        // Draw bullets
        bullets.forEach(bullet => {
          ctx.fillStyle = '#ff00ff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff00ff';
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        ctx.shadowBlur = 0;

        // Draw enemies
        enemies.forEach(enemy => {
          ctx.fillStyle = '#ff3366';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ff3366';
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
        ctx.shadowBlur = 0;

        // Draw particles
        particles.forEach(particle => {
          ctx.fillStyle = `rgba(0, 255, 136, ${particle.life})`;
          ctx.fillRect(particle.x, particle.y, 4, 4);
        });
      }
    };

    // Start game loop
    if (gameState === 'playing') {
      gameLoop();
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [gameState, gameMode, score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      gameObjects.current.keys[e.key] = true;
      
      if (e.key === ' ') {
        e.preventDefault();
        shoot();
      }
    };

    const handleKeyUp = (e) => {
      gameObjects.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Socket.io for online mode
  useEffect(() => {
    if (gameMode === 'online' || gameMode === 'private') {
      // Listen for match found
      socketService.on('match-found', ({ roomId: foundRoomId }) => {
        setRoomId(foundRoomId);
        setGameState('playing');
        initializeGame();
      });

      // Listen for opponent moves
      socketService.on('opponent-move', ({ position }) => {
        // Update opponent position
      });

      // Listen for opponent shots
      socketService.on('opponent-shoot', ({ bullet }) => {
        gameObjects.current.bullets.push(bullet);
      });

      return () => {
        socketService.off('match-found');
        socketService.off('opponent-move');
        socketService.off('opponent-shoot');
      };
    }
  }, [gameMode]);

  const createEnemy = () => ({
    x: Math.random() * 760,
    y: -40,
    width: 40,
    height: 40,
    speed: 2 + Math.random() * 2
  });

  const shoot = () => {
    const { player, bullets } = gameObjects.current;
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 15,
      speed: 10
    });

    // Send to opponent in online mode
    if (roomId) {
      socketService.emit('player-shoot', {
        roomId,
        bullet: bullets[bullets.length - 1]
      });
    }
  };

  const createParticles = (x, y) => {
    for (let i = 0; i < 10; i++) {
      gameObjects.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1
      });
    }
  };

  const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const initializeGame = () => {
    gameObjects.current.player.health = 100;
    gameObjects.current.enemies = [];
    gameObjects.current.bullets = [];
    gameObjects.current.particles = [];
    setScore(0);

    // Spawn initial enemies for bot mode
    if (gameMode === 'bot') {
      for (let i = 0; i < 5; i++) {
        gameObjects.current.enemies.push(createEnemy());
      }
    }
  };

  const startBotMode = () => {
    setGameMode('bot');
    setGameState('playing');
    initializeGame();
  };

  const startOnlineMode = () => {
    setGameMode('online');
    setGameState('matchmaking');
    socketService.emit('find-match', { gameId: 'shooter', userId: user.id });
  };

  const createPrivateRoom = () => {
    setGameMode('private');
    const newRoomId = `shooter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setRoomId(newRoomId);
    const link = `${window.location.origin}/play/shooter?room=${newRoomId}`;
    setShareableLink(link);
    setGameState('playing');
    initializeGame();
  };

  const endGame = async () => {
    setGameState('ended');

    // Submit score if not guest
    if (!user.isGuest) {
      try {
        await leaderboardAPI.submitScore('shooter', score);
      } catch (error) {
        console.error('Failed to submit score:', error);
      }
    }

    // Notify server of match end for online mode
    if (roomId && (gameMode === 'online' || gameMode === 'private')) {
      socketService.emit('match-end', {
        roomId,
        winnerId: user.id,
        stats: { score }
      });
    }
  };

  const returnToMenu = () => {
    setGameState('menu');
    setGameMode(null);
    setRoomId(null);
    setShareableLink('');
  };

  return (
    <div className="shooter-game">
      <div className="game-header">
        <h1 className="neon-glow">Cyber Shooter</h1>
        <button onClick={() => navigate('/games')} className="btn btn-ghost">
          Back to Games
        </button>
      </div>

      {gameState === 'menu' && (
        <div className="game-menu glass">
          <h2>Select Game Mode</h2>
          <div className="mode-buttons">
            <button onClick={startBotMode} className="btn btn-primary">
              🤖 Bot Mode
            </button>
            <button onClick={startOnlineMode} className="btn btn-primary">
              🌐 Online Match
            </button>
            <button onClick={createPrivateRoom} className="btn btn-secondary">
              🔒 Private Room
            </button>
          </div>
          <div className="game-instructions">
            <h3>Controls</h3>
            <p>Arrow Keys: Move</p>
            <p>Space: Shoot</p>
          </div>
        </div>
      )}

      {gameState === 'matchmaking' && (
        <div className="matchmaking glass">
          <div className="loading-spinner"></div>
          <h2>Finding opponent...</h2>
          <button onClick={returnToMenu} className="btn btn-ghost">
            Cancel
          </button>
        </div>
      )}

      {shareableLink && (
        <div className="private-room-link glass">
          <h3>Share this link with your friend:</h3>
          <input type="text" value={shareableLink} readOnly />
          <button onClick={() => navigator.clipboard.writeText(shareableLink)} className="btn btn-primary">
            Copy Link
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="game-canvas"
      />

      {gameState === 'ended' && (
        <div className="game-over glass">
          <h2>Game Over!</h2>
          <p className="final-score">Final Score: {score}</p>
          {user.isGuest && (
            <p className="guest-message">Sign up to save your score!</p>
          )}
          <div className="end-buttons">
            <button onClick={() => { setGameState('playing'); initializeGame(); }} className="btn btn-primary">
              Play Again
            </button>
            <button onClick={returnToMenu} className="btn btn-ghost">
              Main Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShooterGame;
