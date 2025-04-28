import React from 'react';
import './HomePage.css';
import NavigationBar from './components/Navbar';

const HomePage = ({ userType }) => {
  // User type would be passed after login (either 'customer' or 'staff')
  const isStaff = userType === 'staff';

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