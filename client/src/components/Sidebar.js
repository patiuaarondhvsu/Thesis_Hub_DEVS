import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/logs">Users Logs</Link></li>
        <li><Link to="/theses">Theses Menu</Link></li> 
        <li><Link to="/users">Users Accounts</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
