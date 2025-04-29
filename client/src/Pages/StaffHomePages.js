import React from 'react';
import './HomePage.css';
import NavigationBar from './components/staffNavBar';

const StaffHomePages = () => {

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="dashboard-content">
        <h1>Home</h1>
      </div>
    </div>
  );
};

export default StaffHomePages;