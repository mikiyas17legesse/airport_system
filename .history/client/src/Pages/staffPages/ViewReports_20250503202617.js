import React, { useState } from 'react';
import axios from 'axios';
import StaffLayout from './StaffLayout';
import './ViewReports.css';

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [range, setRange] = useState({});

  const handleChange = (e) => setRange({ ...range, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('/api/staff/view-reports', { params: range })
      .then(res => setReports(res.data))
      .catch(err => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <StaffLayout>
    <div className="report-container">
      <h2>Ticket Sales Report</h2>

      {reports.length > 0 && (
        <div className="mt-4">
          <h4>Tickets Sold (Monthly)</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>Tickets Sold</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((row, i) => (
                <tr key={i}>
                  <td>{row.year}</td>
                  <td>{row.month}</td>
                  <td>{row.tickets_sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </StaffLayout>
  );
};

export default ViewReports;