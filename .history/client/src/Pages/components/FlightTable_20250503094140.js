import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import BookedFlightRow from './BookedFlightRow';
import './FlightTable.css';
import {useAuth} from '../../context/AuthContext';

const FlightTable = ({ flights, title, onBookFlight }) => {

  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookedFlights, setBookedFlights] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({
    cardNum: '',
    expDate: '',
    nameOnCard: user.firstName + " " + user.lastName, 
    cardType: 'Visa'
  });

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookClick = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    if (selectedFlight) {
      try {
        const response = await onBookFlight({
          ...selectedFlight,
          ...paymentInfo
        });
        
        setBookedFlights(prev => ({
          ...prev,
          [selectedFlight.Flight_Num]: response.ticketId
        }));
        
        alert(`Booking confirmed! Check your home page for your ticket ID.`);
        setShowModal(false);
      } catch (error) {
        console.error('Booking failed:', error);
      }
    }
  };

  return (
    <div className="flight-table-container">
      <h3 className="title">{title}</h3>
      {flights.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Airline</th>
              <th>Flight No.</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, index) => (
              bookedFlights[flight.Flight_Num] ? (
                <BookedFlightRow 
                  key={index} 
                  flight={flight} 
                  ticketId={bookedFlights[flight.Flight_Num]} 
                />
              ) : (
                <tr key={index}>
                  <td>{flight.Airline_Name}</td>
                  <td>{flight.Flight_Num}</td>
                  <td>{flight.Depart_Date} at {flight.Depart_Time}</td>
                  <td>{flight.Arrival_Date} at {flight.Arrival_Time}</td>
                  <td>{flight.Duration}</td>
                  <td>${flight.Base_Price}</td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleBookClick(flight)}
                    >
                      Book Now
                    </Button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="no-flights-found">No flights found</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} className="booking-modal">
        <Modal.Header closeButton>
          <Modal.Title>Complete Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFlight && (
            <>
              <div className="flight-details">
                <h5>Flight Details</h5>
                <p><strong>Airline:</strong> {selectedFlight.Airline_Name}</p>
                <p><strong>Flight:</strong> {selectedFlight.Flight_Num}</p>
                <p><strong>Departure:</strong> {selectedFlight.Depart_Date} at {selectedFlight.Depart_Time}</p>
                <p><strong>Price:</strong> ${selectedFlight.Base_Price}</p>
              </div>
              <div className="payment-form">
                <h5 className="mt-4">Payment Information</h5>
                <Form>
                  <Form.Group className="form-group">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNum"
                      value={paymentInfo.cardNum}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </Form.Group>
                  
                  <Form.Group className="form-group">
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control
                      type="text"
                      name="expDate"
                      value={paymentInfo.expDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                    />
                  </Form.Group>
                  
                  <Form.Group className="form-group">
                    <Form.Label>Name on Card</Form.Label>
                    <Form.Control
                      type="text"
                      name="nameOnCard"
                      value={paymentInfo.nameOnCard}
                      onChange={handlePaymentChange}
                    />
                  </Form.Group>
                  
                  <Form.Group className="form-group">
                    <Form.Label>Card Type</Form.Label>
                    <Form.Select 
                      name="cardType" 
                      value={paymentInfo.cardType}
                      onChange={handlePaymentChange}
                    >
                      <option value="Visa">Visa</option>
                      <option value="MasterCard">MasterCard</option>
                      <option value="American Express">American Express</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FlightTable;