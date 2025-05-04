import React, { useState } from "react";
import NavigationBar from "../components/Navbar";
import FlightTable from "../components/FlightTable";
import api from "../../api/authHeaders";

const SearchFlights = () => {
  const [tripType, setTripType] = useState("oneway");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [results, setResults] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults({ outboundFlights: [], returnFlights: [] });
    try {
      const params = {
        tripType,
        source,
        destination,
        departureDate: departureDate.toISOString().split('T')[0],
        ...(tripType === "roundtrip" && { returnDate: returnDate.toISOString().split('T')[0] })
      };
      if (!(departureDate instanceof Date) || isNaN(departureDate)) {
        setError("Invalid departure date");
        setLoading(false);
        return;
      }
      const response = await api.get("/customer/search-flights", { params });
      // Response shape: { outboundFlights, returnFlights? }
      const transformFlights = (flights) => flights.map(flight => {
        const calculateDuration = (depTime, arrTime) => {
          const [depHours, depMins] = depTime.split(':').map(Number);
          const [arrHours, arrMins] = arrTime.split(':').map(Number);
          const totalMins = (arrHours*60 + arrMins) - (depHours*60 + depMins);
          return `${Math.floor(totalMins/60)}h ${totalMins%60}m`;
        };import React, { useEffect, useState } from 'react';
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
              <div className="ratings-header">
                <h1>Rate Your Past Flights</h1>
              </div>
              
              {flights.length === 0 ? (
                <div className="no-flights">
                  <h4>No flights available for rating</h4>
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
      
        return {
          ...flight,
          Depart_Date: new Date(flight.Depart_Date).toLocaleDateString(),
          Arrival_Date: new Date(flight.Arrival_Date).toLocaleDateString(),
          Duration: calculateDuration(flight.Depart_Time, flight.Arrival_Time)
        };
      });

      setResults({
        outboundFlights: transformFlights(response.data.outboundFlights || []),
        returnFlights: transformFlights(response.data.returnFlights || [])
      }); 
    } catch (err) {
      console.error("Full error:",err);
      console.error("Response:",err.response);
      setError(err.response?.data?.message || 
        err.message || 
        "Failed to fetch flights. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <div style={{textAlign: "center", color: "#1976d2"}}>Loading...</div>}
      {error && <div style={{color: "red", textAlign: "center"}}>{error}</div>}
      <NavigationBar />
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Search Flights</h2>
        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 16 }}>
              <input
                type="radio"
                value="oneway"
                checked={tripType === "oneway"}
                onChange={() => setTripType("oneway")}
              />
              One Way
            </label>
            <label>
              <input
                type="radio"
                value="roundtrip"
                checked={tripType === "roundtrip"}
                onChange={() => setTripType("roundtrip")}
              />
              Round Trip
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Source City/Airport</label>
            <input
              type="text"
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="Enter source city or airport"
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Destination City/Airport</label>
            <input
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="Enter destination city or airport"
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Departure Date</label>
            <input
              type="date"
              value={departureDate.toISOString().split('T')[0]} // Format for input
              onChange={e => setDepartureDate(new Date(e.target.value))} // Parse to Date
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          {tripType === "roundtrip" && (
            <div style={{ marginBottom: 16 }}>
              <label>Return Date</label>
              <input type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                required={tripType === "roundtrip"}
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                min={departureDate}
              />
            </div>
          )}
          <button type="submit" style={{ width: "100%", padding: 12, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, fontSize: 16, cursor: "pointer" }}>
            Search Flights
          </button>
        </form>
      </div>
      {results.outboundFlights && (
        <div style={{ maxWidth: 800, margin: '2rem auto', padding: 24 }}>
          {results.outboundFlights.length > 0 ? (
            <>
              <FlightTable 
                flights={results.outboundFlights} 
                onBookFlight={async (bookingData) => {
                  try {
                    const response = await api.post('/customer/purchase-ticket', bookingData);
                    return response.data;
                  } catch (error) {
                    console.error('Booking failed:', error);
                    throw error;
                  }
                }}
                title="Outbound Flights"
              />
              {tripType === 'roundtrip' && results.returnFlights.length > 0 && (
                <FlightTable
                  flights={results.returnFlights}
                  onBookFlight={async (bookingData) => {
                    try {
                      const response = await api.post('/customer/purchase-ticket', bookingData);
                      return response.data;
                    } catch (error) {
                      console.error('Booking failed:', error);
                      throw error;
                    }
                  }}
                  title="Return Flights"
                />
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No flights found for your search criteria</p>
              <p>Please try different dates or routes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFlights;