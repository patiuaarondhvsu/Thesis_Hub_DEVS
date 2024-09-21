import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isVisible }) => {
  return (
    <div className={`sidebar ${isVisible ? '' : 'hidden'}`}>
      <h2>Menu</h2>
      <ul>
        <li><Link to="/logs">Logs</Link></li>
        <li><Link to="/theses">Theses</Link></li> 
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
