// src/pages/staffPages/ViewFlights.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewFlights = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    axios.get('/api/staff/flights') // Adjust if needed
      .then(res => setFlights(res.data))
      .catch(err => console.error('Error fetching flights:', err));
  }, []);

  return (
    <div className="container mt-5">
      <h2>All Flights</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Airline</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, index) => (
            <tr key={index}>
              <td>{flight.flight_num}</td>
              <td>{flight.airline_name}</td>
              <td>{flight.source}</td>
              <td>{flight.destination}</td>
              <td>{flight.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFlights;
