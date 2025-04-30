import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateFlight.css';

const CreateFlight = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    flightNumber: '',
    departureAirport: '',
    arrivalAirport: '',
    departureDate: '',
    departureTime: '',
    status: 'on-time' // default value
  });

  const handleChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/staff/create-flight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Flight created successfully!');
          navigate('/staff-home'); // Redirect back to the Staff Home page after creation
        } else {
          alert(data.message || 'Failed to create flight.');
        }
      })
      .catch(error => {
        console.error('Error creating flight:', error);
        alert('An error occurred while creating the flight.');
      });
  };

  return (
    <div className="create-flight-container">
      <h2>Create New Flight</h2>
      <form onSubmit={handleSubmit} className="create-flight-form">
        <label htmlFor="flightNumber">Flight Number:</label>
        <input
          type="text"
          name="flightNumber"
          id="flightNumber"
          value={formData.flightNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="departureAirport">Departure Airport:</label>
        <input
          type="text"
          name="departureAirport"
          id="departureAirport"
          value={formData.departureAirport}
          onChange={handleChange}
          required
        />

        <label htmlFor="arrivalAirport">Arrival Airport:</label>
        <input
          type="text"
          name="arrivalAirport"
          id="arrivalAirport"
          value={formData.arrivalAirport}
          onChange={handleChange}
          required
        />

        <label htmlFor="departureDate">Departure Date:</label>
        <input
          type="date"
          name="departureDate"
          id="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="departureTime">Departure Time:</label>
        <input
          type="time"
          name="departureTime"
          id="departureTime"
          value={formData.departureTime}
          onChange={handleChange}
          required
        />

        <label htmlFor="status">Status:</label>
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="on-time">On-Time</option>
          <option value="delayed">Delayed</option>
        </select>

        <button type="submit" className="submit-button">Create Flight</button>
      </form>

      {/* Back button to return to staff home */}
      <button className="back-button" onClick={() => navigate('/staff-home')}>
        ← Back to Staff Home
      </button>
    </div>
  );
};

export default CreateFlight;
