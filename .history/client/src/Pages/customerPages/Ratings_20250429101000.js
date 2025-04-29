import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/Navbar';

const Ratings = () => {
  const [flights, setFlights] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [status, setStatus] = useState({});

  // Fetch past flights on mount
  // useEffect(() => {
  //   fetch('/api/customer/past-flights')
  //     .then(res => res.json())
  //     .then(data => setFlights(data.flights || []))
  //     .catch(() => setFlights([]));
  // }, []);

  // Handle rating change
  const handleRatingChange = (flightId, value) => {
    setRatings(prev => ({ ...prev, [flightId]: value }));
  };

  // Handle comment change
  const handleCommentChange = (flightId, value) => {
    setComments(prev => ({ ...prev, [flightId]: value }));
  };

  // Submit rating and comment for a flight
  const handleSubmit = (flightId) => {
    fetch('/api/customer/submit-rating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flightId,
        rating: ratings[flightId],
        comment: comments[flightId]
      })
    })
      .then(res => res.json())
      .then(data => {
        setStatus(prev => ({ ...prev, [flightId]: data.success ? "Submitted!" : "Failed to submit" }));
      })
      .catch(() => setStatus(prev => ({ ...prev, [flightId]: "Failed to submit" })));
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
              <label>
                Rating:
                <select
                  value={ratings[flight.id] || ""}
                  onChange={e => handleRatingChange(flight.id, e.target.value)}
                >
                  <option value="">Select</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>
            <div>
              <label>
                Comment:
                <input
                  type="text"
                  value={comments[flight.id] || ""}
                  onChange={e => handleCommentChange(flight.id, e.target.value)}
                  placeholder="Write your comment"
                  style={{ width: "60%" }}
                />
              </label>
            </div>
            <button onClick={() => handleSubmit(flight.id)}>Submit</button>
            {status[flight.id] && <span style={{ marginLeft: 10 }}>{status[flight.id]}</span>}
          </div>
        ))
      )}
    </div>
  );
};

export default Ratings;