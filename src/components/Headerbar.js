// src/components/Headerbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; 
import logo from '../assets/ins_logo.png'; 
import './Headerbar.css';

const Headerbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(null);
  const [subDropdown, setSubDropdown] = useState(null); // State for the nested submenu

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/',{ replace: true });  // Redirect to the login page
  };  


  const handleMouseEnter = (item) => {
    setDropdown(item);
  };

  const handleMouseLeave = () => {
    setDropdown(null);
    setSubDropdown(null); // Close the submenu when leaving the parent dropdown
  };

  const handleDropdownClick = () => {
    setDropdown(null); // Close the dropdown on link click
  };

  return (
    <div className="headerbar-container" >
      <img 
        src={logo} 
        alt="Logo" 
        style={{ height: '170px', marginRight: '10px' }} // Adjust spacing as needed
      />
      <nav>
        <ul style={{ listStyleType: 'none', display: 'flex', margin: 0, padding: 0 }}>
          
          <li
            onMouseEnter={() => handleMouseEnter('doctor')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', padding: '0 15px' }}
          >
            <Link to="" style={{ color: 'white', textDecoration: 'none' }}>Doctor</Link>
            {dropdown === 'doctor' && (
              <ul className="doctor-dropdown">
                <li><Link to="/doctor/manage" className="dropdown-item">Manage</Link></li>
                <li><Link to="/doctor/appointment" className="dropdown-item">Appointment</Link></li>
                <li><Link to="/doctor/ot" className="dropdown-item">OT</Link></li>
                {/* Add more links as needed */}
              </ul>
            )}
          </li>

          <li
            onMouseEnter={() => handleMouseEnter('patient')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', padding: '0 15px' }}
          >
            {/* <Link to="" style={{ color: 'white', textDecoration: 'none'}}>Patient</Link> */}
            <span style={{ color: 'white', cursor: 'pointer' }}>Patient</span>
            {dropdown === 'patient' && (
              <ul className="patient-dropdown">
                <li><Link to="/patient/reg" className="dropdown-item" onClick={handleDropdownClick}>Register</Link></li>
                <li><Link to="/findPatient" className="dropdown-item" onClick={handleDropdownClick}>Find Patient</Link></li>
                <li><Link to="/patient/checked_in" className="dropdown-item" onClick={handleDropdownClick}>Checked-In Patient</Link></li>
                <li><Link to="/patient/manage_ip" className="dropdown-item" onClick={handleDropdownClick}>Manage IP</Link></li>
                <li><Link to="/patient/discharge" className="dropdown-item" onClick={handleDropdownClick}>Manage Discharge</Link></li>
                {/* Add more links as needed */}
              </ul>
            )}
          </li>
    
    
    <li
            onMouseEnter={() => handleMouseEnter('investigation')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', padding: '0 15px' }}
          >
            <Link to="" style={{ color: 'white', textDecoration: 'none' }}>Investigation</Link>
            {dropdown === 'investigation' && (
              <ul style={{ 
                listStyleType: 'none', 
                position: 'absolute', 
                top: '100%', 
                left: '0', 
                background: '#004e9a', 
                padding: '10px', 
                margin: 0,
                minWidth: '200px', // Ensure dropdown has a minimum width
                zIndex: 1 // Ensure dropdown appears above other elements
              }}>
                {/* <li style={{ margin: '0', padding: '5px 0' }}><Link to="/stock/add" style={{ color: 'white', textDecoration: 'none' }}>Add Stock</Link></li>
                <li style={{ margin: '0', padding: '5px 0' }}><Link to="/stock/manage" style={{ color: 'white', textDecoration: 'none' }}>Manage Stock</Link></li> */}
                {/* Add more links as needed */}
              </ul>
            )}
          </li>


          <li
            onMouseEnter={() => handleMouseEnter('accounts')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', padding: '0 15px' }}
          >
            <Link to="" style={{ color: 'white', textDecoration: 'none' }}>Accounts</Link>
            {dropdown === 'accounts' && (
              <ul style={{ 
                listStyleType: 'none', 
                position: 'absolute', 
                top: '100%', 
                left: '0', 
                background: '#004e9a', 
                padding: '10px', 
                margin: 0,
                minWidth: '200px', // Ensure dropdown has a minimum width
                zIndex: 1 // Ensure dropdown appears above other elements
              }}>
                {/* <li style={{ margin: '0', padding: '5px 0' }}><Link to="/stock/add" style={{ color: 'white', textDecoration: 'none' }}>Add Stock</Link></li>
                <li style={{ margin: '0', padding: '5px 0' }}><Link to="/stock/manage" style={{ color: 'white', textDecoration: 'none' }}>Manage Stock</Link></li> */}
                {/* Add more links as needed */}
              </ul>
            )}
          </li>


          <li
            onMouseEnter={() => handleMouseEnter('mis')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', padding: '0 15px' }}
          >
            <Link to="" style={{ color: 'white', textDecoration: 'none' }}>MIS</Link>
            {dropdown === 'mis' && (
              <ul style={{ 
                listStyleType: 'none', 
                position: 'absolute', 
                top: '100%', 
                left: '0', 
                background: '#004e9a', 
                padding: '10px', 
                margin: 0,
                minWidth: '200px', // Ensure dropdown has a minimum width
                zIndex: 1 // Ensure dropdown appears above other elements
              }}>
                {/* <li style={{ margin: '0', padding: '5px 0' }}><Link to="/stock/add" style={{ color: 'white', textDecoration: 'none' }}>Add Stock</Link></li>
                <li style={{ margin: '0', padding: '5px 0' }}><Link to="/stock/manage" style={{ color: 'white', textDecoration: 'none' }}>Manage Stock</Link></li> */}
                {/* Add more links as needed */}
              </ul>
            )}
          </li>

          <li
            onMouseEnter={() => handleMouseEnter('more')}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', padding: '0 15px' }}
          >
            <Link to="" style={{ color: 'white', textDecoration: 'none' }}>More</Link>
            {dropdown === 'more' && (
              <ul style={{ 
                listStyleType: 'none', 
                position: 'absolute', 
                top: '100%', 
                left: '0', 
                background: '#004e9a', 
                padding: '10px', 
                margin: 0,
                minWidth: '200px', // Ensure dropdown has a minimum width
                zIndex: 1 // Ensure dropdown appears above other elements
              }}>
                {/* <li style={{ margin: '0', padding: '5px 0' }}><Link to="/stock/add" style={{ color: 'white', textDecoration: 'none' }}>Add Stock</Link></li>
                <li style={{ margin: '0', padding: '5px 0' }}><Link to="/stock/manage" style={{ color: 'white', textDecoration: 'none' }}>Manage Stock</Link></li> */}
                {/* Add more links as needed */}
              </ul>
            )}
          </li>



          {/* Add more navigation links as needed */}
        </ul>
      </nav>

            {/* Rightmost User Icon and Logout */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <Link to="/" className="login-icon">
          <FaUserCircle size={30} />
        </Link>
    
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>     

    </div>
  );
};

export default Headerbar;
