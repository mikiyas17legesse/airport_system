import React from 'react';
import NavigationBar from 'client/src/pages/components/staffNavBar.js';

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
