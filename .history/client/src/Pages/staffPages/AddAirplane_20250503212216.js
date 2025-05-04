import React, { useState } from 'react';
import api from '../../api/authHeaders';
import StaffLayout from './StaffLayout';
import './AddAirplane.css'; 

const AddAirplane = () => {
  const [data, setData] = useState({
    airline_name: '',
    airplane_id: '',
    num_of_seats: '',
    manufactures: '',
    model_num: '',
    manufacturing_date: ''
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .post('/staff/add-airplane', data)
      .then(() => alert('Airplane added successfully.'))
      .catch((err) =>
        alert('Error: ' + (err.response?.data || err.message))
      );
  };

  return (
    <StaffLayout>
      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <h2 className="mb-4 text-center text-primary">Add New Airplane</h2>
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Airline Name', name: 'airline_name', type: 'text' },
              { label: 'Airplane ID', name: 'airplane_id', type: 'text' },
              { label: 'Number of Seats', name: 'num_of_seats', type: 'number' },
              { label: 'Manufacturer', name: 'manufactures', type: 'text' },
              { label: 'Model Number', name: 'model_num', type: 'text' },
              { label: 'Manufacturing Date', name: 'manufacturing_date', type: 'date' }
            ].map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="form-label">{field.label}</label>
                <input
                  type={field.type}
                  className="form-control"
                  name={field.name}
                  value={data[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="text-center">
              <button type="submit" className="btn btn-success px-4">
                Add Airplane
              </button>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  );
};

export default AddAirplane;
