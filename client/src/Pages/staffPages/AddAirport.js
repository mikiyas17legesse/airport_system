import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddAirport.css';

const AddAirport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Code: '',
    Name: '',
    City: '',
    Country: '',
    Num_Of_Terminals: '',
    Type: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/staff/add-airport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Airport added successfully!');
          navigate('/staff-home');
        } else {
          alert(data.message || 'Failed to add airport.');
        }
      })
      .catch(err => {
        console.error('Error adding airport:', err);
        alert('An error occurred.');
      });
  };

  return (
    <div className="add-airport-container">
      <h2>Add New Airport</h2>
      <form onSubmit={handleSubmit} className="add-airport-form">
        <label htmlFor="Code">Airport Code (3 letters):</label>
        <input type="text" name="Code" maxLength="3" value={formData.Code} onChange={handleChange} required />

        <label htmlFor="Name">Airport Name:</label>
        <input type="text" name="Name" value={formData.Name} onChange={handleChange} />

        <label htmlFor="City">City:</label>
        <input type="text" name="City" value={formData.City} onChange={handleChange} />

        <label htmlFor="Country">Country:</label>
        <input type="text" name="Country" value={formData.Country} onChange={handleChange} />

        <label htmlFor="Num_Of_Terminals">Number of Terminals:</label>
        <input type="number" name="Num_Of_Terminals" value={formData.Num_Of_Terminals} onChange={handleChange} />

        <label htmlFor="Type">Airport Type:</label>
        <input type="text" name="Type" value={formData.Type} onChange={handleChange} placeholder="e.g., International" />

        <button type="submit" className="submit-button">Add Airport</button>
      </form>

      <button className="back-button" onClick={() => navigate('/staff-home')}>
        ← Back to Staff Home
      </button>
    </div>
  );
};

export default AddAirport;
