import React, { useState } from 'react';
import axios from 'axios';

const ViewReports = () => {
  const [range, setRange] = useState({ startDate: '', endDate: '' });
  const [reports, setReports] = useState([]);

  const handleChange = (e) => setRange({ ...range, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('/api/staff/view-reports', { params: range })
      .then(res => setReports(res.data))
      .catch(err => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <div className="container mt-5">
      <h2>Tickets Sold Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Start Date</label>
          <input type="date" className="form-control" name="startDate" value={range.startDate} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>End Date</label>
          <input type="date" className="form-control" name="endDate" value={range.endDate} onChange={handleChange} required />
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
  );
};

export default ViewReports;
