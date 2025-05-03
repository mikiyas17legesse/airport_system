import React, { useState } from 'react';
import axios from 'axios';
import NavigationBar from '../components/staffNavBar';
import styles from './CreateFlight.module.css';

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
    <div className={`container mt-5 ${styles['create-flight-root']}`} style={{ paddingTop: '75px' }}>
      <NavigationBar />
      <div className={styles['create-flight-content']}>
        <h2>Create New Flight</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Airline Name</label>
            <input
              type="text"
              className="form-control"
              name="airline_name"
              value={formData.airline_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Flight Number</label>
            <input
              type="text"
              className="form-control"
              name="flight_num"
              value={formData.flight_num}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Departure Date & Time</label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  name="depart_date"
                  value={formData.depart_date}
                  onChange={handleChange}
                  required
                />
                <span className="input-group-text">at</span>
                <input
                  type="time"
                  className="form-control"
                  name="depart_time"
                  value={formData.depart_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Arrival Date & Time</label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  name="arrival_date"
                  value={formData.arrival_date}
                  onChange={handleChange}
                  required
                />
                <span className="input-group-text">at</span>
                <input
                  type="time"
                  className="form-control"
                  name="arrival_time"
                  value={formData.arrival_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Base Price</label>
            <input
              type="number"
              className="form-control"
              name="base_price"
              value={formData.base_price}
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
              value={formData.airplane_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Departure Airport</label>
            <input
              type="text"
              className="form-control"
              name="departure_airport"
              value={formData.departure_airport}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Arrival Airport</label>
            <input
              type="text"
              className="form-control"
              name="arrival_airport"
              value={formData.arrival_airport}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="On-Time">On-Time</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create Flight</button>
        </form>
      </div>
    </div>
  );
};

export default CreateFlight;