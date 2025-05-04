import React, { useState } from 'react';
import axios from 'axios';
import StaffLayout from './StaffLayout';
import './ViewReports.css';

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [range, setRange] = useState({});

  // TODO: Implement report fetching logic here

  return (
    <StaffLayout>
      <div className="reports-container">
        <h2>View Reports</h2>
      </div>
    </StaffLayout>
  );
};

export default ViewReports;