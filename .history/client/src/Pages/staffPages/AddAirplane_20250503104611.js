import React, { useState } from 'react';
import axios from 'axios';
import NavigationBar from '../components/staffNavBar';

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
      <NavigationBar />
      <h2>Add New Airplane</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Airline Name</label>
          <input
            type="text"
            className="form-control"
            name="airline_name"
            value={data.airline_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Airplane ID</label>
          <input
            type="text"
            className="form-control"
            name="airplane_id"
            value={data.airplane_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Seats</label>
          <input
            type="number"
            className="form-control"
            name="num_of_seats"
            value={data.num_of_seats}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Manufacturer</label>
          <input
            type="text"
            className="form-control"
            name="manufactures"
            value={data.manufactures}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Model Number</label>
          <input
            type="text"
            className="form-control"
            name="model_num"
            value={data.model_num}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Manufacturing Date</label>
          <input
            type="date"
            className="form-control"
            name="manufacturing_date"
            value={data.manufacturing_date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Add Airplane</button>
      </form>
    </div>
  );
};

export default AddAirplane;