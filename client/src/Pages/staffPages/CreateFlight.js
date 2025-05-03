import React, { useState } from 'react';
import api from '../../api/authHeaders';
import StaffLayout from './StaffLayout';

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

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post('/staff/create-flight', formData)
      .then(() => alert('✅ Flight created successfully.'))
      .catch((err) =>
        alert('❌ Error: ' + (err.response?.data || err.message))
      );
  };

  const inputFields = [
    { label: 'Airline Name', name: 'airline_name', type: 'text' },
    { label: 'Flight Number', name: 'flight_num', type: 'text' },
    { label: 'Departure Date', name: 'depart_date', type: 'date' },
    { label: 'Departure Time', name: 'depart_time', type: 'time' },
    { label: 'Arrival Date', name: 'arrival_date', type: 'date' },
    { label: 'Arrival Time', name: 'arrival_time', type: 'time' },
    { label: 'Base Price', name: 'base_price', type: 'number' },
    { label: 'Airplane ID', name: 'airplane_id', type: 'text' },
    { label: 'Departure Airport', name: 'departure_airport', type: 'text' },
    { label: 'Arrival Airport', name: 'arrival_airport', type: 'text' }
  ];

  return (
    <StaffLayout>
      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '650px' }}>
          <h2 className="mb-4 text-center text-primary">Create New Flight</h2>
          <form onSubmit={handleSubmit}>
            {inputFields.map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="form-label">{field.label}</label>
                <input
                  type={field.type}
                  className="form-control"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="mb-4">
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
            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                Create Flight
              </button>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  );
};

export default CreateFlight;
