import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerLogin.css';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '',
    buildingNum: '', street: '', aptName: '',
    city: '', state: '', zip: '',
    passportNum: '', passportExpiration: '', passportCountry: '',
    dateOfBirth: '', phoneNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // console.log('Submitted:', formData)
    // Call the sign up endpoint which handles db querying
    if (isLogin) {
      fetch('/api/auth/login', {
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
          navigate('/');
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to login.');
      });
      return;
    } else {
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Customer created successfully!');
          navigate('/');
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to create customer.');
      });
    }
  };

  
  const renderNameFields = () => (
    <>
      <h4>Personal Information</h4>
      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
    </>
  );

  const renderAddressFields = () => (
    <>
      <h4>Address</h4>
      <input type="text" name="buildingNum" value={formData.buildingNum} onChange={handleChange} placeholder="Building Number" required />
      <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street" required />
      <input type="text" name="aptName" value={formData.aptName} onChange={handleChange} placeholder="Apt (optional)" />
      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
      <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" required />
      <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP" required />
    </>
  );

  const renderPassportFields = () => (
    <>
      <h4>Passport Info</h4>
      <input type="text" name="passportNum" value={formData.passportNum} onChange={handleChange} placeholder="Passport Number" required />
      <input type="date" name="passportExpiration" value={formData.passportExpiration} onChange={handleChange} required />
      <input type="text" name="passportCountry" value={formData.passportCountry} onChange={handleChange} placeholder="Passport Country" required />
    </>
  );

  const renderOtherFields = () => (
    <>
      <h4>Other Info</h4>
      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
    </>
  );

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? 'Customer Login' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && renderNameFields()}

          {/* Email + Password always shown */}
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          
          {!isLogin && (
            <>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
              {renderAddressFields()}
              {renderPassportFields()}
              {renderOtherFields()}
            </>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-form">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CustomerLogin;
