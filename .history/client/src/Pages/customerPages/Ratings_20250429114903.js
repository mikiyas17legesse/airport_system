import React, { useState } from 'react';
import NavigationBar from '../components/Navbar';

const mockFlights = [
  {
    id: 1,
    flightNumber: 'AA123',
    date: '2025-03-15',
    from: 'JFK',
    to: 'LAX'
  },
  {
    id: 2,
    flightNumber: 'DL456',
    date: '2025-04-01',
    from: 'LAX',
    to: 'ORD'
  }
];

const Ratings = () => {
  const [flights] = useState(mockFlights);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [status, setStatus] = useState({});

  const handleRatingChange = (flightId, value) => {
    setRatings(prev => ({ ...prev, [flightId]: value }));
  };

  const handleCommentChange = (flightId, value) => {
    setComments(prev => ({ ...prev, [flightId]: value }));
  };

  // No API call; just simulate submit
  const handleSubmit = (flightId) => {
    setStatus(prev => ({ ...prev, [flightId]: "Submitted!" }));
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
              <label size="3">
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
              <label size="10">
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