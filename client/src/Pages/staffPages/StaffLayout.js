import React from 'react';
import NavigationBar from '../components/staffNavBar';

const StaffLayout = ({ children }) => {
  return (
    <div className="staff-layout">
      <NavigationBar />
      <div className="staff-page-content">
        {children}
      </div>
    </div>
  );
};

export default StaffLayout;
