import React, { useState } from 'react';
import api from '../../api/authHeaders';
import StaffLayout from './StaffLayout';
import './ViewReports.css';

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [range, setRange] = useState({});

  const handleChange = (e) => setRange({ ...range, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.get('/api/staff/view-reports', { params: range })
      .then(res => setReports(res.data))
      .catch(err => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <StaffLayout>
      <div className="report-container">
        <h2>Ticket Sales Report</h2>
        
        <form onSubmit={handleSubmit} className="date-range-form">
          <div className="date-inputs">
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              value={range.startDate || ''}
              required
            />
            <span>to</span>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              value={range.endDate || ''}
              required
            />
          </div>
          <button type="submit" className="generate-btn">Generate Report</button>
        </form>

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