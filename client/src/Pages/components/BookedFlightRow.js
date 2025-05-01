import React from 'react';
import { Badge } from 'react-bootstrap';
import './FlightTable.css'; // Share the same CSS file

export default function BookedFlightRow({ flight, ticketId }) {
  return (
    <tr className="booked-row">
      <td colSpan="7">
        <div className="booked-flight-content">
          <div>
            <strong>{flight.Airline_Name} {flight.Flight_Num}</strong>
            <div>
              {flight.Depart_Date} at {flight.Depart_Time} → {flight.Arrival_Date} at {flight.Arrival_Time}
            </div>
            <div>Duration: {flight.Duration}</div>
          </div>
          <div>
            <Badge bg="success" className="booked-badge">
              Booked! Ticket ID: {ticketId}
            </Badge>
          </div>
        </div>
      </td>
    </tr>
  );
}
