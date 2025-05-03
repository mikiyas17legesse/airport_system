import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewFlights.css';
import styles from './ViewFlights.module.css';
import NavigationBar from '../components/staffNavBar';

const ViewFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/staff/view-flights');
            setFlights(response.data.flights || response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch flights');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date, time) => {
        if (!date || !time) return '';
        // Ensure time has seconds (e.g., 14:05 -> 14:05:00)
        const timeWithSeconds = time.length === 5 ? time + ':00' : time;
        const isoString = `${date}T${timeWithSeconds}`;
        const parsed = new Date(isoString);
        if (isNaN(parsed.getTime())) return date + ' ' + time; // fallback
        const options = {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
        };
        return parsed.toLocaleString('en-US', options);
    };

    const handleViewCustomers = (flight) => {
        navigate(`/staff/view-flights/${flight.Flight_Num}/customers`);
    };

    return (
        <div className={`container mt-5 ${styles['flights-root']}`} style={{ paddingTop: '75px' }}>
            <NavigationBar />
            <div className={`view-flights-container ${styles['flights-content']}`}>
                <h1>Flight Schedule</h1>
                {loading ? (
                    <div>Loading flights...</div>
                ) : error ? (
                    <div style={{ color: 'red' }}>{error}</div>
                ) : (
                    <table className="flights-table">
                        <thead>
                            <tr>
                                <th>Flight Num</th>
                                <th>Airline</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Departure Date</th>
                                <th>Arrival Date</th>
                                <th>Status</th>
                                <th>Time Status</th>
                                <th>View Customers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map((flight, idx) => (
                                <tr key={idx}>
                                    <td>{flight.Flight_Num}</td>
                                    <td>{flight.Airline_Name}</td>
                                    <td>{flight.Departure_Airport} ({flight.Departure_City})</td>
                                    <td>{flight.Arrival_Airport} ({flight.Arrival_City})</td>
                                    <td>{formatDate(flight.Depart_Date, flight.Depart_Time)}</td>
                                    <td>{formatDate(flight.Arrival_Date, flight.Arrival_Time)}</td>
                                    <td>{flight.Status}</td>
                                    <td>{flight.time_status ? flight.time_status.charAt(0).toUpperCase() + flight.time_status.slice(1) : ''}</td>
                                    <td>
                                        <button onClick={() => handleViewCustomers(flight)} className="btn btn-info btn-sm">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewFlights;