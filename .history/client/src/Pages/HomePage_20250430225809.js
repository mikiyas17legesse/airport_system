import React from 'react';
import './HomePage.css';
import NavigationBar from './components/Navbar';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="dashboard-content">
        <h1>Home</h1>
        {user && (
          <div>
            <p>Welcome, {user.firstName}!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;