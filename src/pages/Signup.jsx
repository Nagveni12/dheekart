import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEmailRegistered, addUser } from '../data/users';

const Signup = ({ setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password) {
      setError('Please fill all fields');
      return;
    }
    
    // Check if email already registered
    if (isEmailRegistered(email)) {
      setError('Email already registered! Please login.');
      return;
    }
    
    // Add new user to database
    addUser({
      email,
      password,
      name
    });
    
    setSuccess('Account created successfully! Logging you in...');
    
    // Auto login after 2 seconds
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      
      navigate('/home');
    }, 2000);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">🛒 DheeKart</h2>
            <h5 className="text-center mb-4">Create new account</h5>
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            
            {success && (
              <div className="alert alert-success">{success}</div>
            )}
            
            <form onSubmit={handleSignup}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
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
              
              <button type="submit" className="btn btn-success w-100 mb-3">
                Sign Up
              </button>
              
              <p className="text-center">
                Already have account? <a href="/login">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;