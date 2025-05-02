import React, { useState } from 'react';
import axios from 'axios';
import NavigationBar from '../components/staffNavBar';

const ChangeFlightStatus = () => {
  const [form, setForm] = useState({
    airline_name: '',
    flight_num: '',
    status: ''
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/staff/change-flight-status', form)
      .then(() => alert('Flight status updated successfully.'))
      .catch((err) => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="container mt-5">
      <NavigationBar />
      <h2>Change Flight Status</h2>
      <form onSubmit={handleSubmit}>
        {['airline_name', 'flight_num', 'status'].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field.replace('_', ' ')}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Update Status</button>
      </form>
    </div>
  );
};

export default ChangeFlightStatus;