import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import NavigationBar from '../components/Navbar';
import './Ratings.css';
import api from '../../api/authHeaders';

const Ratings = () => {
  const [flights, setFlights] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});
  const { user } = useAuth();

  const handleRatingChange = (flightId, value) => {
    setRatings(prev => ({ ...prev, [flightId]: value }));
  };

  const handleCommentChange = (flightId, value) => {
    setComments(prev => ({ ...prev, [flightId]: value }));
  };

  const handleSubmit = async (flightId) => {
    const flight = flights.find(f => f.id === flightId);
    setSubmitting(prev => ({ ...prev, [flightId]: true }));
    
    try {
      const response = await api.post('/customer/rate-flight', {
        customer_email: user.email,
        airline_name: flight.Airline_Name,
        flight_num: flight.Flight_Num,
        depart_date: flight.Depart_Date,
        depart_time: flight.Depart_Time,
        rating: ratings[flightId],
        comment: comments[flightId] || ""
      });
      
      setStatus(prev => ({ 
        ...prev, 
        [flightId]: { 
          type: 'success',
          message: response.data.message || "Rating submitted successfully!" 
        }
      }));
      
      // Remove the rated flight from the list after a delay
      setTimeout(() => {
        setFlights(prev => prev.filter(f => f.id !== flightId));
      }, 2000);
      
    } catch (err) {
      console.error("Rating submission failed:", err);
      setStatus(prev => ({
        ...prev,
        [flightId]: { 
          type: 'error',
          message: err.response?.data?.message || "Failed to submit rating"
        }
      }));
    } finally {
      setSubmitting(prev => ({ ...prev, [flightId]: false }));
    }
  };

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const res = await api.get('/customer/past-flights', {
          params: { email: user.email }
        });
        const enriched = res.data.map((f) => ({
          ...f,
          id: `${f.Airline_Name}_${f.Flight_Num}_${f.Depart_Date}_${f.Depart_Time}`,
          flightNumber: `${f.Airline_Name} ${f.Flight_Num}`,
          date: new Date(f.Depart_Date).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
          }),
          from: f.Departure_City,
          to: f.Arrival_City
        }));
        setFlights(enriched);
      } catch (err) {
        console.error('Failed to fetch past flights:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.email) {
      fetchFlights();
    }
  }, [user?.email]);

  const renderStarRating = (flightId) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <span 
            key={star} 
            className={`star ${parseInt(ratings[flightId]) >= star ? 'filled' : ''}`}
            onClick={() => handleRatingChange(flightId, star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="ratings-container">
        <NavigationBar />
        <div className="ratings-loading">
          <div className="loading-spinner"></div>
          <p>Loading your past flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ratings-container">
      <NavigationBar />
      <div className="ratings-header">
        <h1>Rate Your Past Flights</h1>
        <p className="ratings-subtitle">Share your experience and help us improve our service</p>
      </div>
      
      {flights.length === 0 ? (
        <div className="no-flights">
          <div className="no-flights-icon">✓</div>
          <h3>All caught up!</h3>
          <p>You've rated all your past flights or haven't completed any flights yet.</p>
        </div>
      ) : (
        <div className="flights-list">
          {flights.map(flight => (
            <div 
              key={flight.id} 
              className={`flight-card ${status[flight.id]?.type === 'success' ? 'success-fade' : ''}`}
            >
              <div className="flight-info">
                <h3>{flight.flightNumber}</h3>
                <div className="flight-meta">
                  <div className="flight-date">
                    <span className="meta-icon">📅</span>
                    <span>{flight.date}</span>
                  </div>
                  <div className="flight-route">
                    <span className="meta-icon">✈️</span>
                    <span>{flight.from} → {flight.to}</span>
                  </div>
                </div>
              </div>
              
              <div className="rating-form">
                <div className="form-group">
                  <label className="rating-label">Your Rating:</label>
                  {renderStarRating(flight.id)}
                </div>
                
                <div className="form-group">
                  <label className="comment-label">Your Feedback:</label>
                  <textarea
                    className="comment-input"
                    value={comments[flight.id] || ""}
                    onChange={e => handleCommentChange(flight.id, e.target.value)}
                    placeholder="Share your experience with this flight..."
                    rows="3"
                  />
                </div>
                
                <button 
                  className={`submit-btn ${submitting[flight.id] ? 'submitting' : ''}`}
                  onClick={() => handleSubmit(flight.id)}
                  disabled={!ratings[flight.id] || submitting[flight.id]}
                >
                  {submitting[flight.id] ? 'Submitting...' : 'Submit Rating'}
                </button>
                
                {status[flight.id] && (
                  <div className={`status-message ${status[flight.id].type}`}>
                    {status[flight.id].type === 'success' ? '✓ ' : '⚠ '}
                    {status[flight.id].message}
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