import React, { useEffect, useState } from 'react';
import {useAuth} from '../../context/AuthContext';
import NavigationBar from '../components/Navbar';
import './Ratings.css';
import api from '../../api/authHeaders';


const Ratings = () => {
  const [flights, setFlights] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [status, setStatus] = useState({});
  const {user} = useAuth();

  const handleRatingChange = (flightId, value) => {
    setRatings(prev => ({ ...prev, [flightId]: value }));
  };

  const handleCommentChange = (flightId, value) => {
    setComments(prev => ({ ...prev, [flightId]: value }));
  };

  const handleSubmit = async (flightId) => {
    const flight = flights.find(f => f.id === flightId);
    try {
      const response = await api.post('/customer/rate-flight', {
        customer_email: user.email,
        airline_name: flight.Airline_Name,
        flight_num: flight.Flight_Num,
        depart_date: flight.Depart_Date,
        depart_time: flight.Depart_Time,
        rating: ratings[flightId],
        comment: comments[flightId]
      });
      setStatus(prev => ({ 
        ...prev, 
        [flightId]: response.data.message || "Rating submitted successfully!" 
      }));
    } catch (err) {
      console.error("Rating submission failed:", err);
      setStatus(prev => ({
        ...prev,
        [flightId]: err.response?.data?.message || "Failed to submit rating"
      }));
    }
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await api.get('/customer/past-flights', {
          params: { email: user.email }
        });
        const enriched = res.data.map((f) => ({
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
  }, [user.email]);

  return (
    <div className="ratings-container">
      <NavigationBar />
      {flights.length === 0 ? (
        <div className="no-flights">
          <img src="/images/empty-state.svg" alt="No flights" className="empty-icon" />
          <h3>No flights available for rating</h3>
          <p>You've either rated all your past flights or haven't completed any flights yet.</p>
        </div>
      ) : (
        <div className="flights-list">
          {flights.map(flight => (
            <div key={flight.id} className="flight-card">
              <div className="flight-info">
                <h3>{flight.flightNumber}</h3>
                <div className="flight-meta">
                  <span><strong>Date:</strong> {flight.date}</span>
                  <span><strong>Route:</strong> {flight.from} → {flight.to}</span>
                </div>
              </div>
              
              <div className="rating-form">
                <div className="form-group">
                  <label className="rating-label">
                    Rating:
                    <select
                      className="rating-select"
                      value={ratings[flight.id] || ""}
                      onChange={e => handleRatingChange(flight.id, e.target.value)}
                    >
                      <option value="">Select rating</option>
                      {[1,2,3,4,5].map(n => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'star' : 'stars'}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="comment-label">
                    Feedback:
                    <textarea
                      className="comment-input"
                      value={comments[flight.id] || ""}
                      onChange={e => handleCommentChange(flight.id, e.target.value)}
                      placeholder="Share your experience..."
                      rows="3"
                    />
                  </label>
                </div>
                
                <button 
                  className="submit-btn" 
                  onClick={() => handleSubmit(flight.id)}
                  disabled={!ratings[flight.id]}
                >
                  Submit Rating
                </button>
                
                {status[flight.id] && (
                  <div className={`status-message ${status[flight.id].includes('success') ? 'success' : 'error'}`}>
                    {status[flight.id]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ratings;