import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffHomePage.css';
import NavigationBar from './components/staffNavBar';

const StaffHomePages = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/')
  };

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="dashboard-content">
        <h1>Home</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default StaffHomePages;
