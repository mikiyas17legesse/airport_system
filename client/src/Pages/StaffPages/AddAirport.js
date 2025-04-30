import React, { useState } from 'react';
import axios from 'axios';

const AddAirport = () => {
  const [airport, setAirport] = useState({
    code: '',
    name: '',
    city: '',
    country: '',
    num_of_terminals: '',
    type: ''
  });

  const handleChange = (e) => setAirport({ ...airport, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/staff/add-airport', airport)
      .then(() => alert('Airport added successfully.'))
      .catch((err) => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="container mt-5">
      <h2>Add New Airport</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(airport).map(([key, val]) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{key.replace('_', ' ')}</label>
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
        <button type="submit" className="btn btn-info">Add Airport</button>
      </form>
    </div>
  );
};

export default AddAirport;
