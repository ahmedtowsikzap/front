import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard() {
  const [userSheets, setUserSheets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAssignedSheets() {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me'); // Replace with the actual endpoint for the logged-in user's data
        setUserSheets(response.data.assignedSheets);
        setError('');
      } catch (err) {
        console.error('Error fetching user sheets:', err);
        setError('Failed to load sheets. Please try again later.');
      }
    }
    fetchAssignedSheets();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">User Dashboard</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div>
        {userSheets.length > 0 ? (
          <ul className="list-disc pl-5">
            {userSheets.map((sheet) => (
              <li key={sheet._id} className="mb-2">
                <a
                  href={sheet.sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {sheet.sheetUrl}
                </a>
                <div className="text-sm text-gray-600">
                  Assigned on: {new Date(sheet.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sheets assigned to you yet.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
