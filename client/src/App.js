import './App.css';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import GuestPage from './pages/GuestPage';
import StaffLogin from './pages/StaffLogin';
import CustomerLogin from './pages/CustomerLogin';
import HomePage from './pages/HomePage';
import SearchFlights from './pages/customerPages/SearchFlights';
import Ratings from './pages/customerPages/Ratings';
import Bookings from './pages/customerPages/Bookings';
import StaffHomePage from './pages/StaffHomePage';
import ViewFlights from './pages/staffPages/ViewFlights';
import CreateFlight from './pages/staffPages/CreateFlight';
import ChangeFlightStatus from './pages/staffPages/ChangeFlightStatus';
import AddAirplane from './pages/staffPages/AddAirplane';
import AddAirport from './pages/staffPages/AddAirport';
import FlightRatings from './pages/staffPages/FlightRatings';
import ViewReports from './pages/staffPages/ViewReports';
import ViewFlightCustomers from './pages/staffPages/ViewFlightCustomers';

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
            <Route path="/search-flights" element={<SearchFlights />} />
            
            {/* Customer-protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/book-flights" element={<Bookings />} />
              <Route path="/submit-ratings" element={<Ratings />} />
            </Route>
            
            {/* Staff-protected routes */}
            <Route element={<ProtectedRoute requiredRole="staff" />}>
              <Route path="/staff-home" element={<StaffHomePage />} />
              <Route path="/view-flights" element={<ViewFlights />} />
              <Route path="/create-flight" element={<CreateFlight />} />
              <Route path="/change-status" element={<ChangeFlightStatus />} />
              <Route path="/add-airplane" element={<AddAirplane />} />
              <Route path="/add-airport" element={<AddAirport />} />
              <Route path="/flight-ratings" element={<FlightRatings />} />
              <Route path="/view-reports" element={<ViewReports />} />
              <Route path="/staff/view-flights/:flightNum/customers" element={<ViewFlightCustomers />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
