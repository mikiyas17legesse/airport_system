import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import MainPage from './Pages/MainPage';
import StaffLogin from './Pages/StaffLogin';
import CustomerLogin from './Pages/CustomerLogin';
=======
import MainPage from './pages/MainPage';
import StaffLogin from './pages/StaffLogin';
import CustomerLogin from './pages/CustomerLogin';
import HomePage from './pages/HomePage';
>>>>>>> fc95099de19b9e1442be7886f9a962f69908c558

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
<<<<<<< HEAD
=======
          <Route path="/home" element={<HomePage />} />
>>>>>>> fc95099de19b9e1442be7886f9a962f69908c558
        </Routes>
      </div>
    </BrowserRouter>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> fc95099de19b9e1442be7886f9a962f69908c558
