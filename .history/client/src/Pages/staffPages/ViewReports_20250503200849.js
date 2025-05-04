import React, { useState } from 'react';
import StaffLayout from './StaffLayout';
import './ViewReports.css';

const ViewReports = () => {
  const [reports, setReports] = useState([]);

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
                  {/* table content */}
                </tr>
              </thead>
            </table>
          </div>
        )}
      </div>
    </StaffLayout>
  );
};

export default ViewReports;