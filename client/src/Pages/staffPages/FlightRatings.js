import React, { useState } from 'react';
import axios from 'axios';
import NavigationBar from '../components/staffNavBar';

const ViewFlightRatings = () => {
  const [query, setQuery] = useState({
    airline_name: '',
    flight_num: '',
    depart_date: '',
    depart_time: ''
  });
  const [result, setResult] = useState(null);
  const [touched, setTouched] = useState({
    airline_name: false,
    flight_num: false,
    depart_date: false,
    depart_time: false
  });

  // Validation helpers
  const validateAirline = (name) => /^[a-zA-Z\s]{2,}$/.test(name);
  const validateFlightNum = (num) => /^\d{1,6}$/.test(num);
  const validateDate = (date) => Boolean(date);
  const validateTime = (time) => /^\d{2}:\d{2}$/.test(time);

  const isValid = {
    airline_name: validateAirline(query.airline_name),
    flight_num: validateFlightNum(query.flight_num),
    depart_date: validateDate(query.depart_date),
    depart_time: validateTime(query.depart_time)
  };

  const handleChange = (e) => setQuery({ ...query, [e.target.name]: e.target.value });
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('/api/staff/view-flight-ratings', { params: query })
      .then(res => setResult(res.data))
      .catch(err => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="container mt-5" style={{ paddingTop: '75px' }}>
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
            onBlur={handleBlur}
            required
          />
          {touched.airline_name && (
            isValid.airline_name ? (
              <div style={{ color: 'green' }}>Valid Input</div>
            ) : (
              <div style={{ color: 'red' }}>Enter a valid airline name (letters only)</div>
            )
          )}
        </div>
        <div className="mb-3">
          <label>Flight Number</label>
          <input
            type="text"
            name="flight_num"
            className="form-control"
            value={query.flight_num}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.flight_num && (
            isValid.flight_num ? (
              <div style={{ color: 'green' }}>Valid Input</div>
            ) : (
              <div style={{ color: 'red' }}>Enter a valid flight number (digits only)</div>
            )
          )}
        </div>
        <div className="mb-3">
          <label>Departure Date</label>
          <input
            type="date"
            name="depart_date"
            className="form-control"
            value={query.depart_date}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.depart_date && (
            isValid.depart_date ? (
              <div style={{ color: 'green' }}>Valid Input</div>
            ) : (
              <div style={{ color: 'red' }}>Select a date</div>
            )
          )}
        </div>
        <div className="mb-3">
          <label>Departure Time</label>
          <input
            type="time"
            name="depart_time"
            className="form-control"
            value={query.depart_time}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.depart_time && (
            isValid.depart_time ? (
              <div style={{ color: 'green' }}>Valid Input</div>
            ) : (
              <div style={{ color: 'red' }}>Enter a valid time (hh:mm)</div>
            )
          )}
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