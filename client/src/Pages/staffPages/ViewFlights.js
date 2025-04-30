import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Add this
import './ViewFlights.css';

const ViewFlights = () => {
  const [flights, setFlights] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    source: '',
    destination: ''
  });

  const navigate = useNavigate(); // ⬅️ Hook for navigation

  useEffect(() => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);

    const formatDate = (date) => date.toISOString().split('T')[0];

    setFilters({
      startDate: formatDate(today),
      endDate: formatDate(future),
      source: '',
      destination: ''
    });
  }, []);

  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetch(`/api/staff/view-flights?startDate=${filters.startDate}&endDate=${filters.endDate}&source=${filters.source}&destination=${filters.destination}`, {
        method: 'GET',
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setFlights(data.flights || []))
        .catch(err => console.error('Failed to load flights:', err));
    }
  }, [filters]);

  const handleChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="view-flights-container">
      <h2>View Flights</h2>

      <div className="filter-section">
        <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        <input type="text" name="source" value={filters.source} onChange={handleChange} placeholder="Source City/Airport" />
        <input type="text" name="destination" value={filters.destination} onChange={handleChange} placeholder="Destination City/Airport" />
      </div>

      <table className="flights-table">
        <thead>
          <tr>
            <th>Flight #</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {flights.length > 0 ? (
            flights.map(flight => (
              <tr key={flight.flight_number}>
                <td>{flight.flight_number}</td>
                <td>{flight.departure_airport}</td>
                <td>{flight.arrival_airport}</td>
                <td>{flight.departure_date}</td>
                <td>{flight.departure_time}</td>
                <td>{flight.status}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">No flights found.</td></tr>
          )}
        </tbody>
      </table>

      {/* ⬇️ Add this button */}
      <button className="back-button" onClick={() => navigate('/staff-home')}>
        ← Back to Staff Home
      </button>
    </div>
  );
};

export default ViewFlights;
