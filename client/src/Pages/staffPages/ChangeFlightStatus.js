import React, { useState } from 'react';
import api from '../../api/authHeaders';
import StaffLayout from './StaffLayout';

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
    api
      .post('/staff/change-flight-status', form)
      .then(() => alert('✅ Flight status updated successfully.'))
      .catch((err) =>
        alert('❌ Error: ' + (err.response?.data || err.message))
      );
  };

  return (
    <StaffLayout>
      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <h2 className="text-center text-primary mb-4">Change Flight Status</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Airline Name</label>
              <input
                type="text"
                className="form-control"
                name="airline_name"
                value={form.airline_name}
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
                value={form.flight_num}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                name="status"
                value={form.status}
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
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  );
};

export default ChangeFlightStatus;
