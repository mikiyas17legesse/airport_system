import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddAirplane.css';

const AddAirplane = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ID: '',
    Num_Of_Seats: '',
    Manufactures: '',
    Model_Num: '',
    Manufacturing_Date: ''
  });
  

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/staff/add-airplane', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Airplane added successfully!');
          navigate('/staff-home');
        } else {
          alert(data.message || 'Failed to add airplane.');
        }
      })
      .catch(err => {
        console.error('Error adding airplane:', err);
        alert('An error occurred.');
      });
  };

  return (
    <div className="add-airplane-container">
      <h2>Add New Airplane</h2>
      <form onSubmit={handleSubmit} className="add-airplane-form">
      <label htmlFor="ID">Airplane ID:</label>
      <input type="number" name="ID" value={formData.ID} onChange={handleChange} required />

      <label htmlFor="Num_Of_Seats">Number of Seats:</label>
      <input type="number" name="Num_Of_Seats" value={formData.Num_Of_Seats} onChange={handleChange} />

      <label htmlFor="Manufactures">Manufacturer:</label>
      <input type="text" name="Manufactures" value={formData.Manufactures} onChange={handleChange} />

      <label htmlFor="Model_Num">Model Number:</label>
      <input type="text" name="Model_Num" value={formData.Model_Num} onChange={handleChange} />

      <label htmlFor="Manufacturing_Date">Manufacturing Date:</label>
      <input type="date" name="Manufacturing_Date" value={formData.Manufacturing_Date} onChange={handleChange} />
        <button type="submit" className="submit-button">Add Airplane</button>
      </form>

      <button className="back-button" onClick={() => navigate('/staff-home')}>
        ← Back to Staff Home
      </button>
    </div>
  );
};

export default AddAirplane;
