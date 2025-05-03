import React, { useState } from 'react';
import api from '../../api/authHeaders';
import StaffLayout from './StaffLayout';

const ViewFlightRatings = () => {
  const [query, setQuery] = useState({
    airline_name: '',
    flight_num: '',
    depart_date: '',
    depart_time: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setQuery({ ...query, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    api
      .get('/staff/view-flight-ratings', { params: query })
      .then((res) => setResult(res.data))
      .catch((err) =>
        alert('❌ Error: ' + (err.response?.data || err.message))
      );
  };

  return (
    <StaffLayout>
      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <h2 className="text-center text-secondary mb-4">View Flight Ratings</h2>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Airline Name', name: 'airline_name', type: 'text' },
              { label: 'Flight Number', name: 'flight_num', type: 'text' },
              { label: 'Departure Date', name: 'depart_date', type: 'date' },
              { label: 'Departure Time', name: 'depart_time', type: 'time' }
            ].map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="form-label">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  className="form-control"
                  value={query[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div className="text-center">
              <button type="submit" className="btn btn-secondary px-4">
                Search
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-4">
              <h5 className="text-center">Average Rating: <strong>{result.average_rating || 'N/A'}</strong></h5>
              {result.reviews.length > 0 ? (
                <ul className="list-group mt-3">
                  {result.reviews.map((r, i) => (
                    <li key={i} className="list-group-item">
                      ⭐ {r.Rating} — <em>{r.Comment || 'No comment provided'}</em>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center mt-3">No reviews available for this flight.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  );
};

export default ViewFlightRatings;
