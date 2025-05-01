import React from 'react';
import './HomePage.css';
import NavigationBar from './components/Navbar';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  
  console.log('Current user:', user); // Add this line

  const handleViewUpcomingFlights = () => {
    console.log('Viewing upcoming flights...');

  };

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div className="dashboard-content">
        {user ? (
          <div className="welcome-container">
            <h1>Welcome back, {user.firstName}!</h1>
            <p className="welcome-subtext">
              Ready to book your next adventure? Explore available flights below.
            </p>
            <div className="quick-actions">
              <button className="action-btn" onClick={handleViewUpcomingFlights}>View My Upcoming Flights</button>
            </div>
          </div>
        ) : (
          <h1>Welcome to Airline Management System</h1>
        )}
      </div>
    </div>
  );
};

export default HomePage;