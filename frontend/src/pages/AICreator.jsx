import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AICreator.css';

const AICreator = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [gameIdea, setGameIdea] = useState('');
  const [gamePlan, setGamePlan] = useState('');
  const [gameCode, setGameCode] = useState({ html: '', css: '', js: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  if (user?.isGuest) {
    return (
      <div className="ai-creator">
        <nav className="navbar glass">
          <div className="navbar-brand">
            <Link to="/dashboard">
              <h1 className="neon-text">NGGames</h1>
            </Link>
          </div>
        </nav>

        <div className="container">
          <div className="guest-block glass-intense">
            <h1>🤖 AI Game Creator</h1>
            <p>You must have an account to create games.</p>
            <p>Register now to unlock this amazing feature!</p>
            <Link to="/auth" className="btn btn-primary">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!gameIdea.trim()) {
      alert('Please enter a game idea');
      return;
    }

    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      setGamePlan(`
Game Plan for: "${gameIdea}"

1. CONCEPT ANALYSIS
   - Game Type: ${gameIdea.toLowerCase().includes('shooter') ? 'Shooter' : 'Action'}
   - Target Audience: Casual to Hardcore gamers
   - Difficulty: Medium
   - Estimated Playtime: 5-15 minutes per session

2. CORE MECHANICS
   - Player controls: Keyboard/Mouse
   - Objective: Score-based gameplay
   - Win condition: Achieve highest score
   - Lose condition: Health reaches zero

3. VISUAL DESIGN
   - Style: Vector graphics with neon effects
   - Color scheme: Cyberpunk theme
   - Animation: 60 FPS smooth transitions
   - Effects: Particle systems, glow effects

4. TECHNICAL IMPLEMENTATION
   - Canvas API for rendering
   - Collision detection system
   - Score tracking
   - Sound effects integration

5. FEATURES TO IMPLEMENT
   - Single player mode
   - Progressive difficulty
   - Power-ups system
   - Leaderboard integration
      `);
      setStep(2);
      setIsGenerating(false);
    }, 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate code generation
    setTimeout(() => {
      setGameCode({
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameIdea}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="game-container">
    <canvas id="gameCanvas"></canvas>
    <div id="score">Score: <span id="scoreValue">0</span></div>
  </div>
  <script src="game.js"></script>
</body>
</html>`,
        css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0a0a0f;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: Arial, sans-serif;
}

#game-container {
  position: relative;
}

#gameCanvas {
  border: 2px solid #00ffff;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
}

#score {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #00ffff;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffff;
}`,
        js: `const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let gameRunning = true;

// Game state
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 5
};

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Game loop
function gameLoop() {
  if (!gameRunning) return;

  // Clear canvas
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update player
  if (keys['w'] || keys['ArrowUp']) player.y -= player.speed;
  if (keys['s'] || keys['ArrowDown']) player.y += player.speed;
  if (keys['a'] || keys['ArrowLeft']) player.x -= player.speed;
  if (keys['d'] || keys['ArrowRight']) player.x += player.speed;

  // Keep player in bounds
  player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

  // Draw player
  ctx.fillStyle = '#00ffff';
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#00ffff';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  // Update score
  score++;
  scoreElement.textContent = Math.floor(score / 60);

  requestAnimationFrame(gameLoop);
}

gameLoop();`
      });
      setStep(3);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="ai-creator">
      <nav className="navbar glass">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h1 className="neon-text">NGGames</h1>
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="ai-creator-header">
          <h1>🤖 AI Game Creator</h1>
          <p>Turn your ideas into playable games</p>
        </div>

        <div className="creator-steps glass">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span>Idea</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span>Plan</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span>Generate</span>
          </div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span>Preview</span>
          </div>
        </div>

        {step === 1 && (
          <div className="step-content glass-intense">
            <h2>Describe Your Game Idea</h2>
            <textarea
              value={gameIdea}
              onChange={(e) => setGameIdea(e.target.value)}
              placeholder="Example: A fast-paced shooter game where the player fights waves of enemies in a neon cyberpunk city..."
              rows={8}
            />
            <button 
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={isGenerating}
            >
              {isGenerating ? 'Analyzing...' : 'Analyze Idea'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content glass-intense">
            <h2>Game Plan</h2>
            <div className="game-plan">
              <pre>{gamePlan}</pre>
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating Code...' : 'Generate Code'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content glass-intense">
            <h2>Generated Code</h2>
            <div className="code-tabs">
              <div className="code-section">
                <h3>index.html</h3>
                <pre><code>{gameCode.html}</code></pre>
              </div>
              <div className="code-section">
                <h3>style.css</h3>
                <pre><code>{gameCode.css}</code></pre>
              </div>
              <div className="code-section">
                <h3>game.js</h3>
                <pre><code>{gameCode.js}</code></pre>
              </div>
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>
                Preview Game
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content glass-intense">
            <h2>Live Preview</h2>
            <div className="game-preview">
              <iframe
                title="Game Preview"
                srcDoc={`
                  ${gameCode.html.replace('<link rel="stylesheet" href="style.css">', `<style>${gameCode.css}</style>`)}
                  ${gameCode.html.includes('</body>') ? '' : `<script>${gameCode.js}</script>`}
                `.replace('<script src="game.js"></script>', `<script>${gameCode.js}</script>`)}
              />
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep(3)}>
                Edit Code
              </button>
              <button className="btn btn-primary">
                Save & Publish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICreator;
