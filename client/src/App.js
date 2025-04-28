import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


//Goodbye Page
import Goodbye from './pages/Goodbye';
// General pages
import MainPage from './pages/MainPage';
import CustomerLogin from './pages/CustomerLogin';
import StaffLogin from './pages/StaffLogin';
import HomePage from './pages/HomePage';
import StaffHomePages from './pages/StaffHomePages';

// Customer pages
import SearchFlights from './pages/customerPages/SearchFlights';
import Ratings from './pages/customerPages/Ratings';
import Bookings from './pages/customerPages/Bookings';

// Staff pages (from StaffPages folder)
import CreateFlight from './pages/StaffPages/CreateFlight';
import ChangeStatus from './pages/StaffPages/ChangeStatus';
import AddAirplane from './pages/StaffPages/AddAirplane';
import AddAirport from './pages/StaffPages/AddAirport';
import ViewFlights from './pages/StaffPages/ViewFlights';
import ViewRatings from './pages/StaffPages/ViewRatings';
import ViewReports from './pages/StaffPages/ViewReports';

// Public pages
import PublicFlightSearch from './pages/PublicFlightSearch';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* General Routes */}
          <Route path="/goodbye" element={<Goodbye />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/public-flights" element={<PublicFlightSearch />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/staff-home" element={<StaffHomePages />} />

          {/* Customer Routes */}
          <Route path="/search-flights" element={<SearchFlights />} />
          <Route path="/submit-ratings" element={<Ratings />} />
          <Route path="/book-flights" element={<Bookings />} />

          {/* Staff Routes */}
          <Route path="/create-flight" element={<CreateFlight />} />
          <Route path="/change-status" element={<ChangeStatus />} />
          <Route path="/add-airplane" element={<AddAirplane />} />
          <Route path="/add-airport" element={<AddAirport />} />
          <Route path="/view-flights" element={<ViewFlights />} />
          <Route path="/view-flight-ratings" element={<ViewRatings />} />
          <Route path="/view-reports" element={<ViewReports />} />
          <Route path="/search-flights" element={<SearchFlights />} />
          <Route path="/submit-ratings" element={<Ratings />} />
          <Route path="/book-flights" element={<Bookings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
