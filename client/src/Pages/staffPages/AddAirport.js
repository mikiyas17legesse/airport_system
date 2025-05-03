import React, { useState } from 'react';
import api from '../../api/authHeaders';
import StaffLayout from './StaffLayout';

const AddAirport = () => {
  const [airport, setAirport] = useState({
    code: '',
    name: '',
    city: '',
    country: '',
    num_of_terminals: '',
    type: ''
  });

  const handleChange = (e) =>
    setAirport((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post('/staff/add-airport', airport)
      .then(() => alert('✅ Airport added successfully.'))
      .catch((err) =>
        alert('❌ Error: ' + (err.response?.data || err.message))
      );
  };

  const inputFields = [
    { label: 'Airport Code', name: 'code', type: 'text' },
    { label: 'Airport Name', name: 'name', type: 'text' },
    { label: 'City', name: 'city', type: 'text' },
    { label: 'Country', name: 'country', type: 'text' },
    { label: 'Number of Terminals', name: 'num_of_terminals', type: 'number' }
  ];

  return (
    <StaffLayout>
      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <h2 className="mb-4 text-center text-primary">Add New Airport</h2>
          <form onSubmit={handleSubmit}>
            {inputFields.map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="form-label">{field.label}</label>
                <input
                  type={field.type}
                  className="form-control"
                  name={field.name}
                  value={airport[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="form-label">Type</label>
              <select
                className="form-control"
                name="type"
                value={airport.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="International">International</option>
                <option value="Domestic">Domestic</option>
              </select>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-info px-4">
                Add Airport
              </button>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  );
};

export default AddAirport;
