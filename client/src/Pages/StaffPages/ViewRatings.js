import React, { useState } from 'react';
import axios from 'axios';

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
    axios.get('/api/staff/view-flight-ratings', { params: query })
      .then(res => setResult(res.data))
      .catch(err => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="container mt-5">
      <h2>View Flight Ratings</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(query).map(([key, val]) => (
          <div className="mb-3" key={key}>
            <label>{key.replace('_', ' ')}</label>
            <input
              type="text"
              name={key}
              className="form-control"
              value={val}
              onChange={handleChange}
              required
            />
          </div>
        ))}
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
