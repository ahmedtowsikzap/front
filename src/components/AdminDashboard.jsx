// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('');

  useEffect(() => {
    async function fetchData() {
      const usersResponse = await axios.get('http://localhost:5000/api/users');
      setUsers(usersResponse.data);

      const sheetsResponse = await axios.get('http://localhost:5000/api/sheets');
      setSheets(sheetsResponse.data);
    }

    fetchData();
  }, []);

  const assignSheetToUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/sheets/assign', {
        userId: selectedUser,
        sheetId: selectedSheet,
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
        <h3 className="text-xl mb-2">Assign Sheet to User</h3>
        <select
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedSheet(e.target.value)}
          className="p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="">Select Sheet</option>
          {sheets.map((sheet) => (
            <option key={sheet._id} value={sheet._id}>{sheet.sheetUrl}</option>
          ))}
        </select>

        <button
          onClick={assignSheetToUser}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Assign
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
