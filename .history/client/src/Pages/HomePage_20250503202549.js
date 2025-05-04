import React, { useState } from 'react';
import './HomePage.css';
import NavigationBar from './components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/authHeaders';

const HomePage = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleViewUpcomingFlights = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customer/view-my-flights', {
        params: { email: user.email }
      });
      console.log('Received flight data:', response.data.map(f => ({
        airline: f.Airline_Name,
        flightNum: f.Flight_Num,
        ticketId: f.Ticket_ID,
        departDate: f.Depart_Date
      })));
      setFlights(response.data);
    } catch (error) {
      console.error('Flight fetch error:', error);
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
    console.log('Preparing cancel request with:', {
      ticketId,
      time: new Date().toISOString()
    });
    if (!ticketId) {
      alert('No ticket selected');
      console.error('Ticket ID is required');
      return;
    }
    console.log('Canceling ticket with ID:', ticketId);
    try {
      const response = await api.delete('/customer/cancel-ticket', {
        data: { ticketId: String(ticketId) } // Ensure it's a string
      });
      console.log('Cancellation successful:', response.data);
      handleViewUpcomingFlights();
      alert(response.data.message || 'Ticket cancelled successfully');
    } catch (error) {
      console.error('Cancel error:', {
        message: error.message,
        response: error.response?.data
      });
      alert(error.response?.data?.message || 'Failed to cancel ticket');
    }
  };

  const isFlightCancellable = (departDate, departTime) => {
    const cleanDate = departDate.split('T')[0];
    const flightDateTime = new Date(`${cleanDate}T${departTime}`);
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
            {flights.length === 0 && (
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
                        onClick={() => {
                            if (!flight.Ticket_ID) {
                                console.error('Missing Ticket_ID in flight:', flight);
                                return;
                            }
                            console.log('Sending cancellation for:', {
                                ticketId: flight.Ticket_ID,
                                flight: `${flight.Airline_Name} ${flight.Flight_Num}`,
                                user: user.email
                            });
                            handleCancelTicket(flight.Ticket_ID);
                        }}
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