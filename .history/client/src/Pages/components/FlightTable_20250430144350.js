import React from 'react';


const FlightTable = ({ flights, title }) => (

    <div style={{ 
      margin: '2rem 0',
      padding: '1.5rem',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#1976d2', marginBottom: '1rem' }}>{title}</h3>
      {flights.length > 0 ? (
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Flight #</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Airline</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Route</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Departure</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Arrival</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <tr key={flight.Flight_Num} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{flight.Flight_Num}</td>
                <td style={{ padding: '12px' }}>{flight.Airline_Name}</td>
                <td style={{ padding: '12px' }}>
                  {flight.Departure_Airport} → {flight.Arrival_Airport}
                </td>
                <td style={{ padding: '12px' }}>
                  {flight.Depart_Date}<br/>
                  {flight.Depart_Time}
                </td>
                <td style={{ padding: '12px' }}>
                  {flight.Arrival_Date}<br/>
                  {flight.Arrival_Time}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                  ${flight.Base_Price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ color: '#666', textAlign: 'center' }}>No flights found</p>
      )}
    </div>
  );

export default FlightTable;