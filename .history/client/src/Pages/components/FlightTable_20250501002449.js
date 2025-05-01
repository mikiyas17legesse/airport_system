import React from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const FlightTable = ({ flights, title, onBookFlight }) => {

  const [showModal, setShowModal] = React.useState(false);
  const [selectedFlight, setSelectedFlight] = React.useState(null);
  const [paymentInfo, setPaymentInfo] = React.useState({
    cardNum: '',
    expDate: '',
    nameOnCard: '',
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

  const handleConfirmBooking = () => {
    if (selectedFlight) {
      onBookFlight({
        ...selectedFlight,
        ...paymentInfo
      });
      setShowModal(false);
    }
  };

  return (
    <div style={{ 
      margin: '2rem 0',
      padding: '1.5rem',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#1976d2', marginBottom: '1rem' }}>{title}</h3>
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
            ))}
          </tbody>
        </Table>
      ) : (
        <p style={{ color: '#666', textAlign: 'center' }}>No flights found</p>
      )}

      {/* Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFlight && (
            <>
              <h5>Flight Details</h5>
              <p><strong>Airline:</strong> {selectedFlight.Airline_Name}</p>
              <p><strong>Flight:</strong> {selectedFlight.Flight_Num}</p>
              <p><strong>Departure:</strong> {selectedFlight.Depart_Date} at {selectedFlight.Depart_Time}</p>
              <p><strong>Price:</strong> ${selectedFlight.Base_Price}</p>
              
              <h5 className="mt-4">Payment Information</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNum"
                    value={paymentInfo.cardNum}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="expDate"
                    value={paymentInfo.expDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Name on Card</Form.Label>
                  <Form.Control
                    type="text"
                    name="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={handlePaymentChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
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