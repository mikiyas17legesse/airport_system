import React, { useState } from 'react';
import axios from 'axios';
import StaffLayout from './StaffLayout';
import './ViewReports.css';

const ViewReports = () => {
  const [range, setRange] = useState({ startDate: '', endDate: '' });
  const [reports, setReports] = useState([]);

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
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Start Date</label>
            <input 
              type="date" 
              className="form-control" 
              name="startDate" 
              value={range.startDate} 
              onChange={(e) => setRange({...range, startDate: e.target.value})} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>End Date</label>
            <input 
              type="date" 
              className="form-control" 
              name="endDate" 
              value={range.endDate} 
              onChange={(e) => setRange({...range, endDate: e.target.value})} 
              required 
            />
          </div>
          <button className="btn btn-dark">Generate Report</button>
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