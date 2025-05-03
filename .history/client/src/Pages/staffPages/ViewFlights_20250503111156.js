import React, { useState, useEffect } from 'react';
import api from '../../api/authHeaders';
import './ViewFlights.css';
import NavigationBar from '../components/staffNavBar';

const ViewFlights = () => {
    const [flights, setFlights] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        departure: '',
        arrival: '',
        startDate: '',
        endDate: '',
        airline: ''
    });

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async (params = {}) => {
        try {
            setLoading(true);
            // Changed endpoint to match backend staff route
            const response = await api.get('/staff/view-flights', { params });
            setFlights(response.data.flights || response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch flights');
        } finally {
            setLoading(false);
        }
    };

    const fetchFlightCustomers = async (flightId) => {
        try {
            setLoading(true);
            const response = await api.get(`/flights/${flightId}/customers`);
            setCustomers(response.data.customers);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFlights({
            ...filters,
            startDate: filters.startDate || new Date().toISOString(),
            endDate: filters.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
    };

    const handleReset = () => {
        setFilters({
            departure: '',
            arrival: '',
            startDate: '',
            endDate: '',
            airline: ''
        });
        fetchFlights();
    };

    const handleViewCustomers = (flight) => {
        setSelectedFlight(flight);
        fetchFlightCustomers(flight.Flight_Num);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    return (
        <div className="container mt-5">
            <NavigationBar />
            <div className="view-flights-container">
                <h1>Flight Schedule</h1>
                
                <div className="flight-filters">
                    <form onSubmit={handleSearch}>
                        <div className="filter-row">
                            <div className="form-group">
                                <label>Departure Airport</label>
                                <input 
                                    type="text" 
                                    name="departure" 
                                    value={filters.departure}
                                    onChange={handleFilterChange}
                                    placeholder="e.g., JFK"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Arrival Airport</label>
                                <input 
                                    type="text" 
                                    name="arrival" 
                                    value={filters.arrival}
                                    onChange={handleFilterChange}
                                    placeholder="e.g., LAX"
                                />
                            </div>
                        </div>
                        
                        <div className="filter-row">
                            <div className="form-group">
                                <label>Start Date</label>
                                <input 
                                    type="date" 
                                    name="startDate" 
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>End Date</label>
                                <input 
                                    type="date" 
                                    name="endDate" 
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        
                        <div className="filter-row">
                            <div className="form-group">
                                <label>Airline</label>
                                <input 
                                    type="text" 
                                    name="airline" 
                                    value={filters.airline}
                                    onChange={handleFilterChange}
                                    placeholder="e.g., Delta"
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="search-button">Search Flights</button>
                        <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
                    </form>
                </div>
                
                {loading ? (
                    <div className="loading">Loading flights...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div className="flights-list">
                        {flights.length === 0 ? (
                            <div className="no-flights">No flights found matching your criteria</div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Flight #</th>
                                        <th>Airline</th>
                                        <th>Departure</th>
                                        <th>Arrival</th>
                                        <th>Departure Time</th>
                                        <th>Arrival Time</th>
                                        <th>Status</th>
                                        <th>View Customers</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flights.map(flight => (
                                        <tr key={flight.Flight_Num}>
                                            <td>{flight.Flight_Num}</td>
                                            <td>{flight.AirlineName}</td>
                                            <td>{flight.DepartureAirport} ({flight.Departure_Airport})</td>
                                            <td>{flight.ArrivalAirport} ({flight.Arrival_Airport})</td>
                                            <td>{formatDate(flight.Departure_Time)}</td>
                                            <td>{formatDate(flight.Arrival_Time)}</td>
                                            <td className={`status-${flight.Status.toLowerCase()}`}>
                                                {flight.Status}
                                            </td>
                                            <td>
                                                <button type="button" onClick={() => handleViewCustomers(flight)}>View Customers</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                
                {selectedFlight && (
                    <div className="flight-customers">
                        <h2>Customers for Flight {selectedFlight.Flight_Num}</h2>
                        <ul>
                            {customers.map(customer => (
                                <li key={customer.Customer_ID}>{customer.Name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewFlights;