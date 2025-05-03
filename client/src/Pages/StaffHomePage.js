import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffHomePage.css';
import NavigationBar from './components/staffNavBar';

const StaffHomePages = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const quickLinks = [
    { label: 'View Flights', path: '/view-flights' },
    { label: 'Create Flight', path: '/create-flight' },
    { label: 'Change Flight Status', path: '/change-flight-status' },
    { label: 'Add Airplane', path: '/add-airplane' },
    { label: 'Add Airport', path: '/add-airport' },
    { label: 'View Reports', path: '/view-reports' },
    { label: 'View Flight Ratings', path: '/view-flight-ratings' }
  ];

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="dashboard-content container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-primary">Welcome, Staff Member!</h1>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            Logout
          </button>
        </div>

        {/* Quick Links */}
        <div className="row g-4">
          {quickLinks.map((link, i) => (
            <div className="col-md-4" key={i}>
              <div
                className="card shadow-sm h-100 text-center p-3 quick-link-card"
                role="button"
                onClick={() => navigate(link.path)}
              >
                <h5>{link.label}</h5>
              </div>
            </div>
          ))}
        </div>

        {/* Announcements */}
        <div className="card mt-5 p-4 shadow-sm">
          <h4 className="mb-3">📢 Announcements</h4>
          <ul>
            <li>New flight scheduling feature launching next week.</li>
            <li>Please ensure all flight statuses are updated before departure time.</li>
            <li>System maintenance is scheduled for Sunday, 12–2 AM.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StaffHomePages;
