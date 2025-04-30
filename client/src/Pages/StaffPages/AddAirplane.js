import React, { useState } from 'react';
import axios from 'axios';

const AddAirplane = () => {
  const [data, setData] = useState({
    airline_name: '',
    airplane_id: '',
    num_of_seats: '',
    manufactures: '',
    model_num: '',
    manufacturing_date: ''
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/staff/add-airplane', data)
      .then(() => alert('Airplane added successfully.'))
      .catch((err) => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="container mt-5">
      <h2>Add New Airplane</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(data).map(([key, val]) => (
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
        <button type="submit" className="btn btn-success">Add Airplane</button>
      </form>
    </div>
  );
};

export default AddAirplane;
