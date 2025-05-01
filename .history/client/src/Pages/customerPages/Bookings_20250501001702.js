import React, { useState } from "react";
import NavigationBar from "../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Bookings = () => {
    const { user } = useAuth();
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({
        cardNum: '',
        expDate: '',
        nameOnCard: '',
        cardType: 'Visa',
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFlightSearch = async (searchParams) => {
        try {
            const response = await axios.get('/api/search-flights', { params: searchParams });
            setFlights(response.data);
        } catch (error) {
            console.error('Flight search failed:', error);
            alert('Failed to search flights');
        }
    };

    const handlePurchase = async () => {
        if (!selectedFlight) {
            alert('Please select a flight first');
            return;
        }

        // Validate payment info
        if (!paymentInfo.cardNum || !paymentInfo.expDate || !paymentInfo.nameOnCard || 
            !paymentInfo.firstName || !paymentInfo.lastName) {
            alert('Please fill all payment details');
            return;
        }

        setIsLoading(true);
        try {
            const bookingData = {
                ...selectedFlight,
                ...paymentInfo
            };

            const response = await axios.post('/api/purchase-ticket', bookingData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            alert(`Ticket booked successfully! Ticket ID: ${response.data.ticketId}`);
            // Reset form or redirect
        } catch (error) {
            console.error('Booking failed:', error);
            alert(error.response?.data?.error || 'Booking failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <NavigationBar />
        <div className="container">
            
            <h1>Book a Flight</h1>
            
            {/* Flight Search Component would go here */}
            
            {selectedFlight && (
                <div className="booking-form">
                    <h3>Flight Details</h3>
                    <p>Airline: {selectedFlight.airlineName}</p>
                    <p>Flight Number: {selectedFlight.flightNum}</p>
                    <p>Departure: {selectedFlight.departDate} at {selectedFlight.departTime}</p>
                    
                    <h3>Payment Information</h3>
                    <div className="form-group">
                        <label>Card Number</label>
                        <input 
                            type="text" 
                            name="cardNum" 
                            value={paymentInfo.cardNum} 
                            onChange={handlePaymentChange} 
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Expiration Date</label>
                        <input 
                            type="text" 
                            name="expDate" 
                            value={paymentInfo.expDate} 
                            onChange={handlePaymentChange} 
                            placeholder="MM/YY"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Name on Card</label>
                        <input 
                            type="text" 
                            name="nameOnCard" 
                            value={paymentInfo.nameOnCard} 
                            onChange={handlePaymentChange} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Card Type</label>
                        <select name="cardType" value={paymentInfo.cardType} onChange={handlePaymentChange}>
                            <option value="Visa">Visa</option>
                            <option value="MasterCard">MasterCard</option>
                            <option value="American Express">American Express</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={paymentInfo.firstName} 
                            onChange={handlePaymentChange} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={paymentInfo.lastName} 
                            onChange={handlePaymentChange} 
                        />
                    </div>
                    
                    <button 
                        onClick={handlePurchase}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Bookings;