import React, { useState } from 'react';
import axios from 'axios';
import './PublicFlightSearch.css';

const PublicFlightSearch = () => {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    arrival: '',
    departureDate: '',
    returnDate: '',
    isRoundTrip: false
  });
  
  const [flights, setFlights] = useState({
    outbound: [],
    return: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const params = {
        departure: searchParams.departure,
        arrival: searchParams.arrival,
        departureDate: searchParams.departureDate
      };
      
      if (searchParams.isRoundTrip && searchParams.returnDate) {
        params.returnDate = searchParams.returnDate;
      }
      
      const response = await axios.get('/api/public/flights', { params });
      setFlights(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="public-flight-search">
      <h2>Find Flights</h2>
      
      <form onSubmit={handleSearch}>
        <div className="form-row">
          <div className="form-group">
            <label>From (City or Airport)</label>
            <input
              type="text"
              name="departure"
              value={searchParams.departure}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>To (City or Airport)</label>
            <input
              type="text"
              name="arrival"
              value={searchParams.arrival}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Departure Date</label>
            <input
              type="date"
              name="departureDate"
              value={searchParams.departureDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isRoundTrip"
                checked={searchParams.isRoundTrip}
                onChange={handleInputChange}
              />
              Round Trip
            </label>
            
            {searchParams.isRoundTrip && (
              <input
                type="date"
                name="returnDate"
                value={searchParams.returnDate}
                onChange={handleInputChange}
                min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
                required={searchParams.isRoundTrip}
              />
            )}
          </div>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      <div className="flight-results">
        {flights.outbound.length > 0 && (
          <div className="flight-section">
            <h3>Outbound Flights</h3>
            <ul>
              {flights.outbound.map(flight => (
                <li key={flight.Flight_Number} className="flight-item">
                  <div className="flight-info">
                    <span className="flight-number">{flight.AirlineName} {flight.Flight_Number}</span>
                    <span className="flight-route">
                      {flight.DepartureAirport} → {flight.ArrivalAirport}
                    </span>
                    <span className="flight-time">
                      {formatDate(flight.Departure_Time)} - {formatDate(flight.Arrival_Time)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {flights.return.length > 0 && (
          <div className="flight-section">
            <h3>Return Flights</h3>
            <ul>
              {flights.return.map(flight => (
                <li key={flight.Flight_Number} className="flight-item">
                  <div className="flight-info">
                    <span className="flight-number">{flight.AirlineName} {flight.Flight_Number}</span>
                    <span className="flight-route">
                      {flight.DepartureAirport} → {flight.ArrivalAirport}
                    </span>
                    <span className="flight-time">
                      {formatDate(flight.Departure_Time)} - {formatDate(flight.Arrival_Time)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicFlightSearch;
