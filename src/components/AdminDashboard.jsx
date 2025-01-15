// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedSheetUrl, setSelectedSheetUrl] = useState('');
  const [newSheetUrl, setNewSheetUrl] = useState('');
  const [role, setRole] = useState(''); // Track the role dynamically

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch users and sheets data
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        setUsers(usersResponse.data);
  
        const sheetsResponse = await axios.get('http://localhost:5000/api/sheets');
        setSheets(sheetsResponse.data);
  
        // Fetch the logged-in user's role using the correct URL with query parameter
        const authResponse = await axios.get(`http://localhost:5000/api/users/me?username=${selectedUsername}`);
        setRole(authResponse.data.role); // Assuming the backend returns the user object with a `role` field
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchData();
  }, [selectedUsername]); // Dependency array ensures that it runs when selectedUsername changes
  

  const uploadSheet = async () => {
    if (!newSheetUrl) {
      alert('Please enter a valid Google Sheets URL.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/sheets/create', { sheetUrl: newSheetUrl });
      setSheets([...sheets, response.data.sheet]);
      alert('Sheet uploaded successfully');
      setNewSheetUrl('');
    } catch (error) {
      alert('Failed to upload sheet');
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
        role, // Include the role dynamically
      });
      alert('Sheet assigned successfully');
    } catch (error) {
      alert('Failed to assign sheet');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Admin Dashboard</h2>

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
    className={`bg-blue-500 text-white p-2 rounded ${!selectedUsername || !selectedSheetUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={!selectedUsername || !selectedSheetUrl}
  >
    Assign
  </button>
  <p className="text-red-500 mt-2">
    {!selectedUsername && "Please select a user."}
    {!selectedSheetUrl && "Please select a sheet."}
  </p>
</div>

    </div>
  );
}

export default AdminDashboard;
