import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation for role access
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedSheetUrl, setSelectedSheetUrl] = useState('');
  const [newSheetUrl, setNewSheetUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Track errors for user feedback

  const location = useLocation();
  const role = location.state?.role || ''; // Access role from state, fallback to empty string

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        setUsers(usersResponse.data);

        const sheetsResponse = await axios.get('http://localhost:5000/api/sheets');
        setSheets(sheetsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Failed to fetch data. Please try again later.');
      }
    }
    fetchData();
  }, []);

  const uploadSheet = async () => {
    if (!newSheetUrl.trim()) {
      alert('Please enter a valid Google Sheets URL.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/sheets/create', { sheetUrl: newSheetUrl });
      setSheets([...sheets, response.data.sheet]);
      alert('Sheet uploaded successfully!');
      setNewSheetUrl('');
    } catch (error) {
      console.error('Error uploading sheet:', error);
      alert('Failed to upload sheet. Please try again.');
    }
  };

  const assignSheetToUser = async () => {
    if (!selectedUsername || !selectedSheetUrl) {
      alert('Please select both a user and a sheet.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/sheets/assign', {
        username: selectedUsername,
        sheetUrl: selectedSheetUrl,
        role,
      });
      alert('Sheet assigned successfully!');
    } catch (error) {
      console.error('Error assigning sheet:', error);
      alert('Failed to assign sheet. Please try again.');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Admin Dashboard</h2>
      <p className="mb-4">Role: <strong>{role}</strong></p>

      {role !== 'CEO' && role !== 'Manager' ? (
        <p className="text-red-500">You do not have permission to access admin features.</p>
      ) : (
        <>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          {/* Upload Sheet Section */}
          <div className="mb-6">
            <h3 className="text-xl mb-2">Upload a New Sheet</h3>
            <input
              type="text"
              value={newSheetUrl}
              onChange={(e) => setNewSheetUrl(e.target.value)}
              placeholder="Enter Google Sheets URL"
              className="p-2 mb-4 border border-gray-300 rounded w-full"
            />
            <button onClick={uploadSheet} className="bg-green-500 text-white p-2 rounded">
              Upload Sheet
            </button>
          </div>

          {/* Assign Sheet to User Section */}
          <div className="mb-6">
            <h3 className="text-xl mb-2">Assign Sheet to User</h3>
            <select
              onChange={(e) => setSelectedUsername(e.target.value)}
              className="p-2 mb-4 border border-gray-300 rounded w-full"
              value={selectedUsername}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setSelectedSheetUrl(e.target.value)}
              className="p-2 mb-4 border border-gray-300 rounded w-full"
              value={selectedSheetUrl}
            >
              <option value="">Select Sheet</option>
              {sheets.map((sheet) => (
                <option key={sheet._id} value={sheet.sheetUrl}>
                  {sheet.sheetUrl}
                </option>
              ))}
            </select>

            <button
              onClick={assignSheetToUser}
              className={`bg-blue-500 text-white p-2 rounded ${
                !selectedUsername || !selectedSheetUrl ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!selectedUsername || !selectedSheetUrl}
            >
              Assign
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
