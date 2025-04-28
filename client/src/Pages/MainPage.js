import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicFlightSearch from './PublicFlightSearch';
import './MainPage.css';

const MainPage = () => {
    const navigate = useNavigate();
    const handleStaffClick = () => { navigate('/staff-login'); };
    const handleCustomerClick = () => { navigate('/customer-login'); };

  return (
    <div className="main-page">
      <div className="main-content">
        <h1>Welcome to Airline Management System</h1>
        
        {/* Public Flight Search Section */}
        <div className="public-search-section">
          <h2>Search Flights</h2>
          <PublicFlightSearch />
        </div>
        
        <p className="subtitle">Please select your role to continue</p>
        <div className="button-container">
          <button 
          className="role-button staff-button" 
          onClick={handleStaffClick}
          >
            Staff
          </button>
          <button 
          className="role-button customer-button"
          onClick={handleCustomerClick}
          >
            Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;