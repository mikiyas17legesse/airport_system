import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from '../components/staffNavBar';
import styles from './ViewFlightCustomers.module.css';

const ViewFlightCustomers = () => {
    const { flightNum } = useParams();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, [flightNum, fetchCustomers]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/flights/${flightNum}/customers`);
            setCustomers(response.data.customers || []);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`container mt-5 ${styles['customers-root']}`} style={{ paddingTop: '75px' }}>
            <NavigationBar />
            <div className={`view-customers-container ${styles['customers-content']}`}>
                <h2>Customers for Flight {flightNum}</h2>
                {loading ? (
                    <div>Loading customers...</div>
                ) : error ? (
                    <div style={{ color: 'red' }}>{error}</div>
                ) : customers.length === 0 ? (
                    <div>No customers found for this flight.</div>
                ) : (
                    <ul>
                        {customers.map((customer, i) => (
                            <li key={i}>{customer.Name} ({customer.Email})</li>
                        ))}
                    </ul>
                )}
                <button onClick={() => navigate('/view-flights')} className="btn btn-secondary btn-sm mt-3">Back to Flights</button>
            </div>
        </div>
    );
};

export default ViewFlightCustomers;
