import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffLogin.css';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    airlineName: ''
  });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!isLogin) {
      fetch('/api/auth/staff-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Staff created successfully!');
          navigate('/staff-home');
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to create staff.');
      });
    } else {
      fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Login successful.');
          navigate('/staff-home');
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to login.');
      });
    }
  };

  const NameFields = () => <>
    <h4>Personal Information</h4>
    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
  </>;

  const ContactFields = () => <>
    <h4>Contact Information</h4>
    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
    <input type="text" name="airlineName" value={formData.airlineName} onChange={handleChange} placeholder="Airline Name" required />
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