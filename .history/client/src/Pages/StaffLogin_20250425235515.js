import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffLogin.css';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: '', password: '', confirmPassword: '', 
    email: '', phoneNumber: '',dateOfBirth: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Form submitted:', formData);
  };

  const NameFields = () => <>
    <h4>Name</h4>
    <input type="text" name="lastName" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
  </>;

  const ContactFields = () => <>
    <h4>Contact Info</h4>
    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
  </>;

  const DOBField = () => <>
    <h4>Date of Birth</h4>
    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
  </>;

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? 'Staff Login' : 'Create Staff Account'}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && <NameFields />}

          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />

          {!isLogin && (
            <>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
              <ContactFields />
              <DOBField />
            </>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-form">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        <button className="back-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default StaffLogin;
