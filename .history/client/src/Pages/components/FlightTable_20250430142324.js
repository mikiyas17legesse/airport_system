import React from 'react';

const FlightTable = ({ flights, title }) => (
  <div style={{ marginTop: '2rem' }}>
    <h3>{title}</h3>
    {flights.length > 0 ? (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* ... rest of the table implementation ... */}
      </table>
    ) : (
      <p>No flights found</p>
    )}
  </div>
);

export default FlightTable;