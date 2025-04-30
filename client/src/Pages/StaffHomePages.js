import React from 'react';
import LogoutButton from './components/LogoutButton'; // Adjust path if needed

const StaffHomePages = () => {
  return (
    <div className="container mt-5">
      <h1>Staff Dashboard</h1>
      <p>Welcome back! Use the options below to manage flights.</p>
      <LogoutButton />
    </div>
  );
};

export default StaffHomePages;
