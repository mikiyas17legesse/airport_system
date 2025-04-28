import React from 'react';
import './HomePage.css';
import NavigationBar from './components/Navbar';

const HomePage = () => {

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="dashboard-content">
        <h1>Home</h1>
      </div>
    </div>
  );
};

export default HomePage;