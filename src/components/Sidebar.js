// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaHospital, FaChartLine, FaCalendarCheck, FaUsers, FaBed, FaFileAlt } from 'react-icons/fa'; 
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div style={{ width: '80px', background: '#c3c3c3', padding: '20px', height: '300vh' }}>
      <ul style={{ listStyleType: 'none', padding: 20 }}>
        <li>
          <Link to="/Dashboard" title="Home"> 
            <FaHome size={40} style={{ marginRight: '10px', color: '191970' }} className="icon-hover" />
          </Link>
        </li>
        <li>
          <Link to="/masters"title="Masters">
            <FaHospital size={40} style={{ marginRight: '10px', color: '191970'  }} className="icon-hover" /> 
          </Link>
        </li>
        <li>
          <Link to="/mis"title="MIS">
            <FaChartLine size={40} style={{ marginRight: '10px', color: '191970'  }} className="icon-hover"/> 
          </Link>
        </li>
        <li>
          <Link to="booked-appointments"title="Appointments">
            <FaCalendarCheck size={40} style={{ marginRight: '10px', color: '191970'  }} className="icon-hover"/>
          </Link>
        </li>
        <li>
          <Link to="/patient/checked_in"title="OP Patients">
            <FaUsers size={40} style={{ marginRight: '10px', color: '191970'  }} className="icon-hover"/>
          </Link>
        </li>
        <li>
          <Link to="/patient/manage_ip"title="IP Patients">
            <FaBed size={40} style={{ marginRight: '10px', color: '191970'  }} className="icon-hover"/>
          </Link>
        </li>
        <li>
          <Link to="/discharge"title="Discharge">
            <FaFileAlt size={40} style={{ marginRight: '10px', color: '191970'  }} className="icon-hover"/>
          </Link>
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
