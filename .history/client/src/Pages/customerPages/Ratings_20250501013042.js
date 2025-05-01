import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../components/Navbar';
import './Ratings.css';
import {useAuth} from '../contexts/AuthContext';

const Ratings = () => {
  const [flights, setFlights] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [status, setStatus] = useState({});
  const {user} = useAuth();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get('/api/customer/past-flights', {
          params: { email: user.email }
        });
        // Assign a unique ID per flight based on its composite key
        const enriched = res.data.map((f, index) => ({
          ...f,
          id: `${f.Airline_Name}_${f.Flight_Num}_${f.Depart_Date}_${f.Depart_Time}`,
          flightNumber: `${f.Airline_Name} ${f.Flight_Num}`,
          date: f.Depart_Date,
          from: f.Departure_City,
          to: f.Arrival_City
        }));
        setFlights(enriched);
      } catch (err) {
        console.error('Failed to fetch past flights:', err);
      }
    };
    fetchFlights();
  }, []);

  const handleRatingChange = (flightId, value) => {
    setRatings(prev => ({ ...prev, [flightId]: value }));
  };

  const handleCommentChange = (flightId, value) => {
    setComments(prev => ({ ...prev, [flightId]: value }));
  };

  const handleSubmit = async (flightId) => {
    const flight = flights.find(f => f.id === flightId);
    try {
      await axios.post('/api/customer/ratings', {
        customer_email: userEmail,
        airline_name: flight.Airline_Name,
        flight_num: flight.Flight_Num,
        depart_date: flight.Depart_Date,
        depart_time: flight.Depart_Time,
        rating: ratings[flightId],
        comment: comments[flightId]
      });
      setStatus(prev => ({ ...prev, [flightId]: "Submitted!" }));
    } catch (err) {
      console.error("Rating submission failed:", err);
      setStatus(prev => ({ ...prev, [flightId]: "Failed to submit." }));
    }
  };

  return (
    <div>
      <NavigationBar />
      <h1>Rate Your Past Flights</h1>
      {flights.length === 0 ? (
        <p>No past flights found.</p>
      ) : (
        flights.map(flight => (
          <div key={flight.id} style={{ border: "1px solid #ccc", margin: "20px", padding: "10px" }}>
            <div>
              <strong>Flight:</strong> {flight.flightNumber} | <strong>Date:</strong> {flight.date} | <strong>From:</strong> {flight.from} | <strong>To:</strong> {flight.to}
            </div>
            <div>
              <label className="rating-label">
                Rating:
                <select
                  className="rating-select"
                  value={ratings[flight.id] || ""}
                  onChange={e => handleRatingChange(flight.id, e.target.value)}
                >
                  <option value=""></option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label className="comment-label">
                Comment:
                <input
                  className="comment-input"
                  type="text"
                  value={comments[flight.id] || ""}
                  onChange={e => handleCommentChange(flight.id, e.target.value)}
                  placeholder="Write your comment"
                />
              </label>
            </div>
            <button className="rating-submit-btn" onClick={() => handleSubmit(flight.id)}>Submit</button>
            {status[flight.id] && <span style={{ marginLeft: 10 }}>{status[flight.id]}</span>}
          </div>
        ))
      )}
    </div>
  );
};

export default Ratings;
