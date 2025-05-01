import React, { useState } from "react";
import NavigationBar from "../components/Navbar";
import axios from "axios";
import FlightTable from "../components/FlightTable";

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
      const response = await axios.get("api/customer/search-flights", { params });
      // Response shape: { outboundFlights, returnFlights? }
      const transformFlights = (flights) => flights.map(flight => {
        const calculateDuration = (depTime, arrTime) => {
          const [depHours, depMins] = depTime.split(':').map(Number);
          const [arrHours, arrMins] = arrTime.split(':').map(Number);
          const totalMins = (arrHours*60 + arrMins) - (depHours*60 + depMins);
          return `${Math.floor(totalMins/60)}h ${totalMins%60}m`;
        };
      
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
                    const token = localStorage.getItem('token');
                    const response = await axios.post('api/purchase-ticket', bookingData, {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    return response.data; // Return the response for FlightTable to use
                  } catch (error) {
                    console.log(error);
                    console.error('Booking failed:', error);
                    throw error; // Rethrow to handle in FlightTable
                  }
                }}
                title="Outbound Flights"
              />
              {tripType === 'roundtrip' && results.returnFlights.length > 0 && (
                <FlightTable
                  flights={results.returnFlights}
                  onBookFlight={async (bookingData) => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await axios.post('api/purchase-ticket', bookingData, {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      return response.data; // Return the response for FlightTable to use
                    } catch (error) {
                      console.error('Booking failed:', error);
                      throw error; // Rethrow to handle in FlightTable
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
