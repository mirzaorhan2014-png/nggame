import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import GamesList from './pages/GamesList';
import ShooterGame from './games/ShooterGame';
import Store from './pages/Store';
import Leaderboard from './pages/Leaderboard';
import AICreator from './pages/AICreator';
import './styles/global.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute><GamesList /></ProtectedRoute>} />
      <Route path="/games/shooter" element={<ProtectedRoute><ShooterGame /></ProtectedRoute>} />
      <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/ai-creator" element={<ProtectedRoute><AICreator /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/auth" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
