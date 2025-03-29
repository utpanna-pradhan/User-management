
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Stylesheet/Login.css'

const Login = () => {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      navigate('/users');
    } catch (err) {
      setError('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100 bg-light
    shadow-lg p-3 mb-5 bg-body rounded">
      <div className="card p-4 shadow-lg login-card">
        <h2 className="text-center mb-4 text-primary">Welcome</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>
        </form>

        <p className="text-center mt-3 text-muted small">
          Demo Credentials: <br />
          <strong>eve.holt@reqres.in</strong> / <strong>cityslicka</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;
