import React, { useState } from 'react';
import axios from 'axios';

const CreateFlight = () => {
  const [formData, setFormData] = useState({
    airline_name: '',
    flight_num: '',
    depart_date: '',
    depart_time: '',
    arrival_date: '',
    arrival_time: '',
    base_price: '',
    airplane_id: '',
    departure_airport: '',
    arrival_airport: '',
    status: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/staff/create-flight', formData)
      .then(() => alert('Flight created successfully.'))
      .catch(err => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="container mt-5">
      <h2>Create New Flight</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, val]) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{key.replaceAll('_', ' ')}</label>
            <input
              type="text"
              className="form-control"
              name={key}
              value={val}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Create Flight</button>
      </form>
    </div>
  );
};

export default CreateFlight;
