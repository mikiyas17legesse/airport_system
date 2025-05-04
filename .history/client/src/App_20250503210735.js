import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import GuestPage from './Pages/GuestPage';
import StaffLogin from './Pages/StaffLogin';
import CustomerLogin from './Pages/CustomerLogin';
import HomePage from './Pages/HomePage';
import SearchFlights from './Pages/customerPages/SearchFlights';
import Ratings from './Pages/customerPages/Ratings';
import Bookings from './Pages/customerPages/Bookings';
import StaffHomePage from './Pages/StaffHomePage';
import ViewFlights from './Pages/staffPages/ViewFlights';
import CreateFlight from './Pages/staffPages/CreateFlight';
import ChangeFlightStatus from './Pages/staffPages/ChangeFlightStatus';
import AddAirplane from './Pages/staffPages/AddAirplane';
import AddAirport from './Pages/staffPages/AddAirport';
import FlightRatings from './Pages/staffPages/FlightRatings';
import ViewReports from './Pages/staffPages/ViewReports';
import ViewFlightCustomers from './Pages/staffPages/ViewFlightCustomers';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/guest-page" element={<GuestPage />} />
            
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/search-flights" element={<ProtectedRoute><SearchFlights /></ProtectedRoute>} />
            <Route path="/submit-ratings" element={<ProtectedRoute><Ratings /></ProtectedRoute>} />
            <Route path="/book-flights" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
            
            <Route path="/staff-home" element={<ProtectedRoute><StaffHomePage /></ProtectedRoute>} />
            <Route path="/view-flights" element={<ProtectedRoute><ViewFlights /></ProtectedRoute>} />
            <Route path="/create-flight" element={<ProtectedRoute><CreateFlight /></ProtectedRoute>} />
            <Route path="/change-status" element={<ProtectedRoute><ChangeFlightStatus /></ProtectedRoute>} />
            <Route path="/add-airplane" element={<ProtectedRoute><AddAirplane /></ProtectedRoute>} />
            <Route path="/add-airport" element={<ProtectedRoute><AddAirport /></ProtectedRoute>} />
            <Route path="/flight-ratings" element={<ProtectedRoute><FlightRatings /></ProtectedRoute>} />
            <Route path="/view-reports" element={<ProtectedRoute><ViewReports /></ProtectedRoute>} />
            <Route path="/staff/view-flights/:flightNum/customers" element={<ProtectedRoute><ViewFlightCustomers /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
