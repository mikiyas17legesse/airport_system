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
      <div className="dashboard-content staff-welcome">
        <h1>Welcome, Airline Staff!</h1>
        <p className="welcome-message">
          This is your staff dashboard. Here you can:
        </p>
        <ul className="staff-actions-list">
          <li>View all upcoming, current, and past flights</li>
          <li>Create new flights and manage flight status</li>
          <li>Add airplanes and airports to your airline's network</li>
          <li>View flight ratings and customer feedback</li>
          <li>Access detailed sales and performance reports</li>
        </ul>
        <p className="enjoy-message">Use the navigation bar above to get started. Have a great day!</p>
      </div>
    </div>
  );
};

export default StaffHomePages;
