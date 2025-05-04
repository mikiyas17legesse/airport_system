import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/authHeaders';
import './ViewFlights.css';
import StaffLayout from './StaffLayout';

const ViewFlights = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        // Get all flights for the staff's airline (past, current, future)
        const response = await api.get('/staff/view-flights', {
          params: { airline_name: user.airlineName }
        });
        setFlights(response.data.flights || response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch flights');
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [user.airlineName]);

  // Helper: Use ISO datetime from backend for display and status
  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const dt = new Date(isoString);
    if (isNaN(dt.getTime())) return '';
    // Format as YYYY-MM-DD HH:mm (24h)
    return dt.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');
  };

  const getFlightStatus = (departDateIso) => {
    const now = new Date();
    const flightTime = new Date(departDateIso);
    if (flightTime > now) return 'Upcoming';
    if (flightTime.toDateString() === now.toDateString()) return 'Current';
    return 'Past';
  };

  return (
    <StaffLayout>
      <div className="view-flights-container">
        <h2>{user.airlineName} Flights</h2>
        {loading ? (
          <div className="loading">Loading flights...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="flights-list">
            {flights.length === 0 ? (
              <div className="no-flights">No flights found for your airline</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Flight #</th>
                    <th>Airline</th>
                    <th>Departure Airport</th>
                    <th>Departure City</th>
                    <th>Arrival Airport</th>
                    <th>Arrival City</th>
                    <th>Depart Date/Time</th>
                    <th>Arrival Date/Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map(flight => (
                    <tr key={flight.Flight_Num}>
                      <td>{flight.Flight_Num}</td>
                      <td>{flight.Airline_Name}</td>
                      <td>{flight.Departure_Airport}</td>
                      <td>{flight.Departure_City}</td>
                      <td>{flight.Arrival_Airport}</td>
                      <td>{flight.Arrival_City}</td>
                      <td>{formatDateTime(flight.Depart_Date)}</td>
                      <td>{formatDateTime(flight.Arrival_Date)}</td>
                      <td className={`status-${getFlightStatus(flight.Depart_Date).toLowerCase()}`}>
                        {getFlightStatus(flight.Depart_Date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default ViewFlights;