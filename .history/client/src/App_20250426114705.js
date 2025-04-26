import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages 2/MainPage';
import StaffLogin from './pages 2/StaffLogin';
import CustomerLogin from './pages 2/CustomerLogin';

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
