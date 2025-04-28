import React from 'react';
import { Link } from 'react-router-dom';
import './StaffHomePages.css';

const StaffHomePages = () => {
  return (
    <div className="staff-home-container">
      <div className="staff-content">
        <h1>Staff Dashboard</h1>
        <p className="mb-4">Welcome back! What would you like to do today?</p>
        
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Flight Management</h5>
                <Link to="/create-flight" className="btn btn-primary btn-sm m-1">Create Flight</Link>
                <Link to="/change-status" className="btn btn-primary btn-sm m-1">Change Status</Link>
                <Link to="/view-flights" className="btn btn-primary btn-sm m-1">View Flights</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Airplane Management</h5>
                <Link to="/add-airplane" className="btn btn-primary btn-sm m-1">Add Airplane</Link>
                <Link to="/view-reports" className="btn btn-primary btn-sm m-1">View Reports</Link>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Airport Management</h5>
                <Link to="/add-airport" className="btn btn-primary btn-sm m-1">Add Airport</Link>
                <Link to="/view-flight-ratings" className="btn btn-primary btn-sm m-1">View Ratings</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffHomePages;