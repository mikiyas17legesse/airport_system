import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import StaffLogin from './pages/StaffLogin.js';
import CustomerLogin from './pages/CustomerLogin.js';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
