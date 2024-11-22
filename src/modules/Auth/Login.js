//  src/modules/Auth/Login.js 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axiosConfig from '../../utils/axiosConfig';
import './Login.css';
import logo from '../../assets/ins_logo.png';


const Login = ({ setIsAuthenticated, setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true); 
    
    try {
      const response = await axiosConfig.post('https://hmis-production.up.railway.app/hmis/signin', {
        username,
        password,
      });
  console.log(response)
  
      const { token } = response.data;
  
      // Store the token in local storage
      localStorage.setItem('token', token);
      console.log('Login successful:', response.data.message);
      alert("Login Successfully!");
    
      setLoading(false);
      navigate('/Dashboard', { replace: true }); 


    } catch (error) {
      // Handle errors, including network errors
      if (error.response) {
        // Server responded with a status other than 2xx
        setErrorMessage(error.response.data.message || 'Login failed');
      } else {
        // Network error or other issues
        console.error('Error logging in:', error);
        setErrorMessage('Network error. Please try again later.');
      }
      setLoading(false); // End loading
   }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <img 
        src={logo} 
        alt="Logo" 
        style={{ height: '140px', marginRight: '10px' }} // Adjust spacing as needed
      />
        <h2 className="login-title">Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username" 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password" 
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
