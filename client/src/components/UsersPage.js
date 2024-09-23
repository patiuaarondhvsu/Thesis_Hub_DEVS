// src/UsersPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersPage.css';
import Sidebar from './Sidebar';
import './Sidebar.css';
import Header from './Header';
import Footer from './Footer';

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/');
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const filteredData = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <Header />

      <div className="main-page-users">
        <Sidebar isVisible={sidebarVisible} />
        <div className={`content ${sidebarVisible ? 'sidebar-open' : ''}`}>
          <button onClick={toggleSidebar} className="menu-button">
            ☰
          </button>
          <h1>Users</h1>
          <div className="top-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-bar-users"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <table className="data-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(user => {
                const [firstName, lastName] = user.name.split(' '); // Split the name
                return (
                  <tr key={user._id}>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                    <td>{user.verified ? 'Yes' : 'No'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UsersPage;
