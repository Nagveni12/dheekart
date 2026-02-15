import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUser } from '../data/users';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check if fields are empty
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    
    // Check if user exists in registered users
    const user = findUser(email, password);
    
    if (user) {
      // Valid user - allow login
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', user.name);
      
      // Update state in App.js
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      
      // Redirect to home
      navigate('/home');
    } else {
      // Check if email exists but password wrong
      const emailExists = findUser(email, '');
      if (emailExists) {
        setError('Incorrect password. Please try again.');
      } else {
        // Email not registered
        setError('Email not registered. Please create an account .');
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">🛒 DheeKart</h2>
            <h5 className="text-center mb-4">Login to continue</h5>
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
              
              <p className="text-center">
                New user? <a href="/signup">Create account</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;