import React from 'react';
import { useParams } from 'react-router-dom';
import ShooterGame from '../games/ShooterGame';

const GamePlay = () => {
  const { gameId } = useParams();

  // Route to appropriate game component
  const renderGame = () => {
    switch (gameId) {
      case 'shooter':
        return <ShooterGame />;
      default:
        return (
          <div className="coming-soon">
            <h1>{gameId} - Coming Soon</h1>
            <p>This game is under development</p>
          </div>
        );
    }
  };

  return <div className="game-play">{renderGame()}</div>;
};

export default GamePlay;
