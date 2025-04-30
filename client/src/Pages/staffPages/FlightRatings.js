import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightRatings.css';

const FlightRatings = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(null);

  // Load flights for selection
  useEffect(() => {
    fetch('/api/staff/view-flights', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setFlights(data.flights || []))
      .catch(err => console.error('Error fetching flights:', err));
  }, []);

  const handleSelect = (e) => {
    const [flightNumber, date, time] = e.target.value.split('|');
    const flight = { flightNumber, departDate: date, departTime: time };
    setSelectedFlight(flight);

    fetch(`/api/staff/flight-ratings?flightNumber=${flightNumber}&departDate=${date}&departTime=${time}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setAverage(data.average);
        setRatings(data.ratings);
      })
      .catch(err => console.error('Error fetching ratings:', err));
  };

  return (
    <div className="flight-ratings-container">
      <h2>View Flight Ratings</h2>

      <select onChange={handleSelect}>
        <option value="">-- Select a Flight --</option>
        {flights.map(f => (
          <option
            key={`${f.flight_number}-${f.departure_date}-${f.departure_time}`}
            value={`${f.flight_number}|${f.departure_date}|${f.departure_time}`}
          >
            {f.flight_number} | {f.departure_date} | {f.departure_time}
          </option>
        ))}
      </select>

      {selectedFlight && (
        <>
          <h3>Average Rating: {average || 'No ratings yet'}</h3>
          <table className="ratings-table">
            <thead>
              <tr>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length > 0 ? (
                ratings.map((r, i) => (
                  <tr key={i}>
                    <td>{r.Rating}</td>
                    <td>{r.Comment || 'No comment'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2">No ratings for this flight.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      <button className="back-button" onClick={() => navigate('/staff-home')}>
        ← Back to Staff Home
      </button>
    </div>
  );
};

export default FlightRatings;
