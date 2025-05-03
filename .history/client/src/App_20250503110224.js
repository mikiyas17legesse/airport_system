import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainPage from './pages/MainPage';
import GuestPage from './pages/GuestPage';
import StaffLogin from './pages/StaffLogin';
import CustomerLogin from './pages/CustomerLogin';
import HomePage from './pages/HomePage';
import SearchFlights from './pages/customerPages/SearchFlights'
import Ratings from './pages/customerPages/Ratings'
import ProtectedRoute from './context/ProtectedRoute';
import StaffHomePage from './pages/StaffHomePage';
import ViewFlights from './pages/staffPages/ViewFlights';
import CreateFlight from './pages/staffPages/CreateFlight';
import ChangeFlightStatus from './pages/staffPages/ChangeFlightStatus';
import AddAirplane from './pages/staffPages/AddAirplane';
import AddAirport from './pages/staffPages/AddAirport';
import FlightRatings from './pages/staffPages/FlightRatings';
import ViewReports from './pages/staffPages/ViewReports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/guest-page" element={<GuestPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/search-flights" element={<SearchFlights />} />
              <Route path="/submit-ratings" element={<Ratings />} />
              <Route path="/staff-home" element={<StaffHomePage />} />
              <Route path="/view-flights" element={<ViewFlights />} />
              <Route path="/create-flight" element={<CreateFlight />} />
              <Route path="/change-status" element={<ChangeFlightStatus />} />
              <Route path="/add-airplane" element={<AddAirplane />} />
              <Route path="/add-airport" element={<AddAirport />} />
              <Route path="/flight-ratings" element={<FlightRatings />} />
              <Route path="/view-reports" element={<ViewReports />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
