import React, { useState } from 'react';
import api from '../../api/authHeaders';
import NavigationBar from '../components/staffNavBar';

const ViewFlightRatings = () => {
  const [query, setQuery] = useState({
    airline_name: '',
    flight_num: '',
    depart_date: '',
    depart_time: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setQuery({ ...query, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.get('/staff/view-flight-ratings', { params: query })
      .then(res => setResult(res.data))
      .catch(err => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="container mt-5">
      <NavigationBar />
      <h2>View Flight Ratings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Airline Name</label>
          <input
            type="text"
            name="airline_name"
            className="form-control"
            value={query.airline_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Flight Number</label>
          <input
            type="text"
            name="flight_num"
            className="form-control"
            value={query.flight_num}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Departure Date</label>
          <input
            type="date"
            name="depart_date"
            className="form-control"
            value={query.depart_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Departure Time</label>
          <input
            type="time"
            name="depart_time"
            className="form-control"
            value={query.depart_time}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>
      {result && (
        <div className="mt-4">
          <h4>Average Rating: {result.average_rating || 'N/A'}</h4>
          <ul>
            {result.reviews.map((r, i) => (
              <li key={i}>{r.Rating} stars — {r.Comment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewFlightRatings;