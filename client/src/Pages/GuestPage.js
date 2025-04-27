import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestPage.css';

const GuestPage = () => {
    const navigate = useNavigate();
    const handleStaffClick = () => { navigate('/staff-login'); };
    const handleCustomerClick = () => { navigate('/customer-login'); };
  const [searchInfo, setSearchInfo] = useState({
    source: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    roundTrip: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching flights with:', searchInfo);
  };

  return (
    <div className="guest-container">
      <div className="card">
        <h2>Find Your Flight</h2>
        <p>Enter your information to search for available flights.</p>

        <form onSubmit={handleSearch} className="flight-form">
          <div className="form-group">
            <label>Source City/Airport</label>
            <input 
              type="text" 
              name="source" 
              placeholder="e.g., New York (JFK)" 
              value={searchInfo.source} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Destination City/Airport</label>
            <input 
              type="text" 
              name="destination" 
              placeholder="e.g., Los Angeles (LAX)" 
              value={searchInfo.destination} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Departure Date</label>
            <input 
              type="date" 
              name="departureDate" 
              value={searchInfo.departureDate} 
              onChange={handleChange}
              required
            />
          </div>

          {searchInfo.roundTrip && (
            <div className="form-group">
              <label>Return Date</label>
              <input 
                type="date" 
                name="returnDate" 
                value={searchInfo.returnDate} 
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="roundTrip" 
                checked={searchInfo.roundTrip} 
                onChange={handleChange}
              />
              Round Trip
            </label>
          </div>

          <button type="submit" className="search-button">Search Flights</button>
        </form>

        <div className="divider"></div>

        <div className="registration-section">
          <h3>New Here?</h3>
          <button
          className="register-button"
          onClick = {handleCustomerClick}
          >Register as Customer</button>

          <button
          className="register-button"
          onClick = {handleStaffClick}
          >Register as Staff</button>
        </div>
        <div className="login-section">
            <h3>Have an account with us?</h3>
            <button
                className="register-button"
                onClick={handleCustomerClick}
            >Login as Customer</button>

            <button
                className="register-button"
                onClick={handleStaffClick}
            >Login as Staff</button>
            </div>
        </div>
    </div>
  );
};

export default GuestPage;
