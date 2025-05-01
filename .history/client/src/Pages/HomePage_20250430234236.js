import React, { useState } from 'react';
import './HomePage.css';
import NavigationBar from './components/Navbar';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log('Current user:', user); // Add this line

  const handleViewUpcomingFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customer/view-my-flights?email=${user.email}`);
      const data = await response.json();
      if (response.ok) {
        setFlights(data);
      } else {
        alert(data.message || 'Failed to fetch flights');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="dashboard-content">
        {user ? (
          <div className="welcome-container">
            <h1>Welcome back, {user.firstName}!</h1>
            <p className="welcome-subtext">
              Ready to book your next adventure? Explore available flights below.
            </p>
            <div className="quick-actions">
              <button 
                className="action-btn" 
                onClick={handleViewUpcomingFlights}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View My Upcoming Flights'}
              </button>
            </div>
            
            {flights.length > 0 && (
              <div className="flights-container">
                <h2>Your Upcoming Flights</h2>
                <div className="flights-list">
                  {flights.map((flight) => (
                    <div key={`${flight.Flight_Num}-${flight.Depart_Date}`} className="flight-card">
                      <h3>{flight.Departure_Airport_Name} → {flight.Arrival_Airport_Name}</h3>
                      <p>Departure: {flight.Depart_Date} at {flight.Depart_Time}</p>
                      <p>Price: ${flight.Sold_Price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <h1>Welcome to Airline Management System</h1>
        )}
      </div>
    </div>
  );
};

export default HomePage;