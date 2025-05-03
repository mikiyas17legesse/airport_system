import React, { useState } from 'react';
import './HomePage.css';
import NavigationBar from './components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/authHeaders';

const HomePage = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedFlights, setHasLoadedFlights] = useState(false);

  const handleViewUpcomingFlights = async () => {
    try {
      setLoading(true);
      setHasLoadedFlights(true);
      const response = await api.get('/customer/view-my-flights', {
        params: { email: user.email }
      });
      setFlights(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Failed to fetch flights');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleCancelTicket = async (ticketId) => {
    try {
      const response = await fetch('/api/customer/cancel-ticket', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ticketId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to cancel ticket');
      
      handleViewUpcomingFlights();
      alert(data.message || 'Ticket cancelled successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  const isFlightCancellable = (departDate, departTime) => {
    const flightDateTime = new Date(`${departDate}T${departTime}`);
    const now = new Date();
    const hoursUntilFlight = (flightDateTime - now) / (1000 * 60 * 60);
    return hoursUntilFlight > 24;
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
            
            {hasLoadedFlights && flights.length === 0 && (
              <div className="no-flights-message">
                <p>You don't have any upcoming flights booked yet.</p>
              </div>
            )}
            {flights.length > 0 && (
              <div className="flights-container">
                <h2>Your Upcoming Flights</h2>
                <div className="flights-list">
                  {flights.map((flight) => (
                    <div key={`${flight.Flight_Num}-${flight.Depart_Date}`} className="flight-card">
                      <h3>{flight.Departure_Airport_Name} → {flight.Arrival_Airport_Name}</h3>
                      <p>Departure: {formatDate(flight.Depart_Date)} at {formatTime(flight.Depart_Time)}</p>
                      <div className="flight-actions">
                        <button 
                          className="cancel-btn"
                          onClick={() => handleCancelTicket(flight.Ticket_ID)}
                          disabled={!isFlightCancellable(flight.Depart_Date, flight.Depart_Time)}
                        >
                          Cancel Flight
                        </button>
                      </div>
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