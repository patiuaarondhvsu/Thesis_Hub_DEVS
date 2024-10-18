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
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [usersPerPage] = useState(10); // Users per page

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

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter users based on search query
  const filteredData = currentUsers.filter(user =>
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="App">
      <Header />
      <div className="main-page-users">
        <Sidebar isVisible={sidebarVisible} />
        <div className={`logs-content ${sidebarVisible ? 'sidebar-open' : ''}`}>
          <h1 className="greeting">Good day Aaron!</h1> {/* Greeting */}
          <div className="table-container"> {/* Container box around the table */}
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
                {filteredData.map(user => (
                  <tr key={user._id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                    <td>{user.verified ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
              <span>Page {currentPage}</span>
              <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastUser >= users.length}>Next</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UsersPage;
