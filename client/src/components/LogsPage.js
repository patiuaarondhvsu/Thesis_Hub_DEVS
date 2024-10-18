import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogsPage.css'; // Ensure this CSS file is updated for layout
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); // <-- Added search query
  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs', {
          withCredentials: true,
        });
        const sortedLogs = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sortedLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
  
    fetchLogs();
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Filter logs based on search query
  const filteredLogs = logs.filter(log =>
    log.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate current logs to display
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Calculate total pages
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App">
      <Header />
      <div className="main-page-logs">
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
            </div> {/* Closing the top-bar div */}
            <table className="log-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map(log => {
                  const date = new Date(log.timestamp).toLocaleDateString();
                  const time = new Date(log.timestamp).toLocaleTimeString();
                  return (
                    <tr key={log._id}>
                      <td>{log.message}</td>
                      <td>{date}</td>
                      <td>{time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div> {/* Closing the table-container div */}
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Logs;
