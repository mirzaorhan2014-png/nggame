import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, guestLogin, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/');
    }
  };

  const handleGuestLogin = async () => {
    const result = await guestLogin();
    if (result.success) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="login-card glass"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="logo"
        >
          <h1 className="neon-glow">NGGames</h1>
          <p className="tagline">Professional Esports Platform</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome Back</h2>
          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-message"
            >
              {error}
            </motion.div>
          )}

          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="btn btn-ghost w-full"
            disabled={loading}
          >
            Continue as Guest
          </button>
        </form>

        <div className="register-link">
          <p>Don't have an account?</p>
          <Link to="/register">
            <button className="btn btn-secondary neon-border">
              Register Now
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
