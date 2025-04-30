import React from 'react';

const FlightTable = ({ flights, title }) => (
  <div style={{ marginTop: '2rem' }}>
    <h3>{title}</h3>
    {flights.length > 0 ? (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Departure Date</th>
            <th>Departure Time</th>
            <th>Arrival Date</th>
            <th>Arrival Time</th>
            <th>Duration</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, index) => (
            <tr key={index}>
              <td>{flight.Flight_Number}</td>
              <td>{flight.Depart_Date}</td>
              <td>{flight.Depart_Time}</td>
              <td>{flight.Arrival_Date}</td>
              <td>{flight.Arrival_Time}</td>
              <td>{flight.Duration}</td>
              <td>{flight.Price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No flights found</p>
    )}
  </div>
);

export default FlightTable;