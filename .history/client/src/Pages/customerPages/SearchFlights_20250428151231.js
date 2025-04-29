import React, { useState } from "react";
import NavigationBar from "../components/Navbar";

const SearchFlights = () => {
  const [tripType, setTripType] = useState("oneway");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Placeholder for submit handler
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
    // TODO: Pass searchParams to backend
  };

  return (
    <div>
      <NavigationBar />
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Search Flights</h2>
        <form onSubmit={handleSubmit}>
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

export default SearchFlights;
