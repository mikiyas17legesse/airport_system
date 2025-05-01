import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import StaffLogin from './pages/StaffLogin';
import CustomerLogin from './pages/CustomerLogin';
import HomePage from './pages/HomePage';
import SearchFlights from './pages/customerPages/SearchFlights'
import Ratings from './pages/customerPages/Ratings'
import Bookings from './pages/customerPages/Bookings'
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search-flights" element={<SearchFlights />} />
            <Route path="/submit-ratings" element={<Ratings />} />
            <Route path="/book-flights" element={<Bookings />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
