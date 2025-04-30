import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangeFlightStatus.css';

const ChangeFlightStatus = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [status, setStatus] = useState('');

  // Fetch all upcoming flights for the logged-in staff
  useEffect(() => {
    fetch('/api/staff/view-flights', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setFlights(data.flights || []);
      })
      .catch(err => console.error('Error loading flights:', err));
  }, []);

  // Update status when a flight is selected
  const handleFlightChange = (e) => {
    const flightNum = e.target.value;
    setSelectedFlight(flightNum);

    const flight = flights.find(f => f.flight_number === flightNum);
    setStatus(flight?.status || '');
  };

  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/staff/change-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flightNumber: selectedFlight, newStatus: status })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Flight status updated successfully!');
          navigate('/staff-home');
        } else {
          alert(data.message || 'Failed to update flight status.');
        }
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Something went wrong while updating status.');
      });
  };

  return (
    <div className="change-status-container">
      <h2>Change Flight Status</h2>
      <form onSubmit={handleSubmit} className="change-status-form">
        <label htmlFor="flight">Select Flight:</label>
        <select id="flight" value={selectedFlight} onChange={handleFlightChange} required>
          <option value="">-- Select a Flight --</option>
          {flights.map(flight => (
            <option key={flight.flight_number} value={flight.flight_number}>
              {flight.flight_number} ({flight.departure_airport} → {flight.arrival_airport})
            </option>
          ))}
        </select>

        {selectedFlight && (
          <>
            <label htmlFor="status">New Status:</label>
            <select id="status" value={status} onChange={handleStatusChange}>
              <option value="on-time">On-Time</option>
              <option value="delayed">Delayed</option>
            </select>

            <button type="submit" className="submit-button">Update Status</button>
          </>
        )}
      </form>

      <button className="back-button" onClick={() => navigate('/staff-home')}>
        ← Back to Staff Home
      </button>
    </div>
  );
};

export default ChangeFlightStatus;
