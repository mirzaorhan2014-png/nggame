import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import socketService from './utils/socket';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import GamesPage from './pages/GamesPage';
import GamePlay from './pages/GamePlay';
import StorePage from './pages/StorePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import ClansPage from './pages/ClansPage';
import TournamentsPage from './pages/TournamentsPage';
import SocialPage from './pages/SocialPage';
import AchievementsPage from './pages/AchievementsPage';
import AIGameEnginePage from './pages/AIGameEnginePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, user, fetchUser } = useAuthStore();

  useEffect(() => {
    // Check for existing token and fetch user
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    // Connect socket when authenticated
    if (isAuthenticated && user) {
      socketService.connect(user.id);
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/games" element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
        <Route path="/play/:gameId" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
        <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/profile/:userId?" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/clans" element={<ProtectedRoute><ClansPage /></ProtectedRoute>} />
        <Route path="/tournaments" element={<ProtectedRoute><TournamentsPage /></ProtectedRoute>} />
        <Route path="/social" element={<ProtectedRoute><SocialPage /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
        <Route path="/ai-engine" element={<ProtectedRoute><AIGameEnginePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
