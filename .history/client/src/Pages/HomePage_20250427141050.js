import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-box">
        <h2>Welcome to Airport Management System</h2>
        
        <div className="button-group">
          <button 
            className="action-button"
            onClick={() => navigate('/customer-login')}
          >
            Customer Portal
          </button>
          
          <button 
            className="action-button"
            onClick={() => navigate('/staff-login')}
          >
            Staff Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;