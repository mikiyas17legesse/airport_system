import React, { useState } from "react";
import NavigationBar from "../components/Navbar";
import axios from "axios";
import FlightTable from "../components/FlightTable";


const SearchFlights = () => {
  const [tripType, setTripType] = useState("oneway");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
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
    const response = await axios.get("/api/customer/search-flights", { params });
    // Response shape: { outboundFlights, returnFlights? }
    let flights = response.data.outboundFlights || [];
    setResults({ 
      outboundFlights: flights, 
      returnFlights: response.data.returnFlights || [] 
    });
  } catch (err) {
    setError(err.response?.data?.message || "Failed to fetch flights");
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass these values to backend endpoint later
    const searchParams = {
      tripType,
      source,
      destination,
      departureDate,
      returnDate: tripType === "roundtrip" ? returnDate : null,
    };
    console.log("Search params:", searchParams);
    // Pass searchParams to backend
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
              value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
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
      
      
    </div>
  );
};

{/* <div style={{ maxWidth: 800, margin: '2rem auto', padding: 24 }}>
        {results.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Flight No.</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Airline</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>From</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>To</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Departure</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Arrival</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Price ($)</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Seats</th>
              </tr>
            </thead>
            <tbody>
              {results.map(flight => (
                <tr key={flight.id}>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{flight.flightNumber}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{flight.airline}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{flight.departure}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{flight.arrival}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{new Date(flight.departureTime).toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{new Date(flight.arrivalTime).toLocaleString()}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{flight.price}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{flight.seatsAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> */}

export default SearchFlights;
