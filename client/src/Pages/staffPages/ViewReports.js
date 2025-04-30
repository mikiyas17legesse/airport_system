import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './ViewReports.css';

const ViewReports = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('last_month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [report, setReport] = useState({ total: null, breakdown: [] });

  const handleFetch = () => {
    let query = `/api/staff/view-reports?mode=${mode}`;
    if (mode === 'range') query += `&from=${from}&to=${to}`;

    fetch(query, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setReport(data))
      .catch(err => {
        console.error(err);
        alert('Failed to fetch report.');
      });
  };

  return (
    <div className="report-container">
      <h2>Ticket Sales Report</h2>

      <div className="filter-options">
        <label>
          <input type="radio" name="mode" value="last_month" checked={mode === 'last_month'} onChange={() => setMode('last_month')} />
          Last Month
        </label>
        <label>
          <input type="radio" name="mode" value="last_year" checked={mode === 'last_year'} onChange={() => setMode('last_year')} />
          Last Year
        </label>
        <label>
          <input type="radio" name="mode" value="range" checked={mode === 'range'} onChange={() => setMode('range')} />
          Custom Range
        </label>
      </div>

      {mode === 'range' && (
        <div className="date-range">
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      )}

      <button onClick={handleFetch}>Generate Report</button>

      {report.total !== null && (
        <>
          <h3>Total Tickets Sold: {report.total}</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tickets_sold" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      <button className="back-button" onClick={() => navigate('/staff-home')}>
        ← Back to Staff Home
      </button>
    </div>
  );
};

export default ViewReports;
