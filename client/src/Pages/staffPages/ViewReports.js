import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/authHeaders';
import StaffLayout from './StaffLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ViewReports.css';

const ViewReports = () => {
  const [range, setRange] = useState({ startDate: '', endDate: '' });
  const [reports, setReports] = useState([]);

  const handleChange = (e) => setRange({ ...range, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    api.get('/staff/view-reports', { params: range })
      .then(res => setReports(res.data))
      .catch(err => alert('Error: ' + err.response?.data || err.message));
  };

  return (
    <StaffLayout>
      <div className="report-container">
        <h2>Ticket Sales Report</h2>
        <form onSubmit={handleSubmit} className="report-form">
          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={range.startDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              name="endDate"
              value={range.endDate}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">View Report</button>
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