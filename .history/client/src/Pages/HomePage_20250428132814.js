import React from 'react';
import './HomePage.css';

const HomePage = ({ userType }) => {
  // User type would be passed after login (either 'customer' or 'staff')
  const isStaff = userType === 'staff';

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <header className="dashboard-header">
        <h1>Welcome to Airport Management System</h1>
        <p className="user-role">{isStaff ? 'Staff Dashboard' : 'Customer Dashboard'}</p>
      </header>

      <div className="dashboard-content">
        {isStaff ? (
          <div className="staff-features">
            <div className="feature-card">
              <h3>Flight Management</h3>
              <p>View and manage all flights</p>
            </div>
            <div className="feature-card">
              <h3>Passenger Records</h3>
              <p>Access passenger information</p>
            </div>
          </div>
        ) : (
          <div className="customer-features">
            <div className="feature-card">
              <h3>My Bookings</h3>
              <p>View and manage your flights</p>
            </div>
            <div className="feature-card">
              <h3>Check-in</h3>
              <p>Online check-in for your flights</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;