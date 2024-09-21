import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogsPage.css'; // Ensure this CSS file is updated for layout
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    // Fetch logs from the backend when the component mounts
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logs', {
          withCredentials: true // Add if your backend uses cookies or session-based auth
        });
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="App">
      {/* Header */}
      <Header />
  
      <div className="main-page-logs">
      <h2>System Logs</h2>
        <Sidebar isVisible={sidebarVisible} />
        <div className={`logs-content ${sidebarVisible ? 'sidebar-open' : ''}`}>
          <button onClick={toggleSidebar} className="menu-button">
            ☰
          </button>
    
          <table className="log-table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id}>
                  <td>{log.message}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Logs;
