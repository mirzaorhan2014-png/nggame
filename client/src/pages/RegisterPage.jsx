import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import './LoginPage.css';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 
  'Spain', 'Italy', 'Brazil', 'Mexico', 'Japan', 'South Korea', 'China', 'India', 
  'Turkey', 'Russia', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Other'
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: ''
  });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (!formData.country) {
      setValidationError('Please select a country');
      return;
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      country: formData.country
    });

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
          <p className="tagline">Join the Elite</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Create Account</h2>
          
          {(error || validationError) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="error-message"
            >
              {error || validationError}
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
              minLength="3"
              maxLength="20"
              className="glass-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>

          <div className="form-group">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="glass-input"
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="register-link">
          <p>Already have an account?</p>
          <Link to="/login">
            <button className="btn btn-ghost w-full">
              Login
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
