import React, { useState } from 'react';
import api from '../../api/authHeaders';
import NavigationBar from '../components/staffNavBar';

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
    api.post('/staff/add-airport', airport)
      .then(() => alert('Airport added successfully.'))
      .catch((err) => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="staff-page-wrapper">
      <NavigationBar />
      <div className="staff-content-area">
        <div className="staff-form-wrapper">
          <h2 className="staff-page-header">Add New Airport</h2>
          <form onSubmit={handleSubmit} className="staff-form">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="form-label">Airport Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={airport.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label className="form-label">Airport Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={airport.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
  
            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={airport.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={airport.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
  
            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="form-label">Number of Terminals</label>
                <input
                  type="number"
                  className="form-control"
                  name="num_of_terminals"
                  value={airport.num_of_terminals}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
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
            </div>
  
            <div className="form-submit">
              <button type="submit" className="btn btn-primary btn-lg">
                Add Airport
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAirport;