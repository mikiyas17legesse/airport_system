import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import GuestPage from './Pages/GuestPage';
import StaffLogin from './Pages/StaffLogin';
import CustomerLogin from './Pages/CustomerLogin';
import HomePage from './Pages/HomePage';
import SearchFlights from './Pages/customerPages/SearchFlights'
import Ratings from './Pages/customerPages/Ratings'
import Bookings from './Pages/customerPages/Bookings'

function App() {
  return (
    <BrowserRouter>
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
