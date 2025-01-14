// src/components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    async function fetchSheets() {
      const response = await axios.get('http://localhost:5000/api/sheets/assigned');
      setSheets(response.data);
    }

    fetchSheets();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">User Dashboard</h2>
      <div className="space-y-4">
        {sheets.map((sheet) => (
          <div key={sheet._id} className="bg-white p-4 rounded shadow-md">
            <a href={sheet.sheetUrl} className="text-blue-500" target="_blank" rel="noopener noreferrer">
              View Sheet
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
