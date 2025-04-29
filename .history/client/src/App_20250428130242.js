import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import StaffLogin from './Pages/StaffLogin';
import CustomerLogin from './Pages/CustomerLogin';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
