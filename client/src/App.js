import './App.css';
import { AuthProvider } from './context/AuthContext'; // adjust path if needed

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
            <Route path="/" element={<MainPage />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/guest-page" element={<GuestPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search-flights" element={<SearchFlights />} />
            <Route path="/submit-ratings" element={<Ratings />} />
            <Route path="/book-flights" element={<Bookings />} />
            <Route path="/staff-home" element={<StaffHomePage />} />
            <Route path="/view-flights" element={<ViewFlights />} />
            <Route path="/create-flight" element={<CreateFlight />} />
            <Route path="/change-status" element={<ChangeFlightStatus />} />
            <Route path="/add-airplane" element={<AddAirplane />} />
            <Route path="/add-airport" element={<AddAirport />} />
            <Route path="/flight-ratings" element={<FlightRatings />} />
            <Route path="/view-reports" element={<ViewReports />} />
            <Route path="/staff/view-flights/:flightNum/customers" element={<ViewFlightCustomers />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
