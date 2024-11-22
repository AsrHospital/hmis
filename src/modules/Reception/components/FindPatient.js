// src/modules/Reception/components/FindPatient.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FindPatient.css';
import axios from '../../../utils/axiosConfig';
import { FaSearch } from 'react-icons/fa';

const FindPatient = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null); // Ref for dropdown

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  // Attach event listener to close dropdown on outside click
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };
  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);

    try {
      let params = {};
  
      // Determine which parameter to send based on user input
      if (searchQuery) {
        if (searchQuery.startsWith("INS-")) {
          params.unique_id = searchQuery;
        } else if (/^\d+$/.test(searchQuery)) {
          params.mobile = searchQuery;
        } else {
          params.firstname = searchQuery;
        }
  
        console.log("Searching for:", params); // Log the parameters
  
        const res = await axios.get(`https://hmis-production.up.railway.app/hmis/get-Patient`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          params:params,
        }
         
        );
  
        console.log("API Response:", res.data); // Log the response
  
          // Check if the response is an array and has data
          if (Array.isArray(res.data) && res.data.length > 0) {
            setPatientData(res.data[0]); // Get the first patient
        } else {
            throw new Error('No patient found');
        }
    }
      } catch (err) {
          console.error("API Error:", err); // Log the error for debugging
          setError(err.message);
          setPatientData(null);
      } finally {
          setLoading(false);
      }
      };

      const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // Handle cases where the date is not available
      
        const [year, month, day] = dateString.split('-'); // Split the date string
        return `${day}-${month}-${year}`; // Return the formatted date
      };

      const formatRegDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-GB'); // "dd/mm/yyyy" format
        const formattedTime = date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }); // "hh:mm" format
        return `${formattedDate}-${formattedTime}`;
      };


  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'Verdana', textDecoration: 'underline', color: '#235cc4'}}>Find Patient</h2>
      
      <form onSubmit={handleSearch} style={{ position: 'relative', display: 'inline-block' }}>
        <div style={{ marginBottom: '20px', position: 'relative'  }}>
        <label htmlFor="search" style={{ marginRight: '10px' }}></label>
          {/* Search input with icon inside */}
          <input
            className="custom-input"
            style={{
              width: '400px',
              padding: '8px 40px 8px 10px', // Extra padding for the search icon
              position: 'relative',
              borderRadius: '5px',
            }}
            type="text"
            id="search"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Enter Patient's Name or ID or Mobile No."
          />
          {/* Search icon */}
          <FaSearch
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              backgroundColor: '#008B8B',
              padding: '10px', // Add some padding to the background
              borderRadius: '50%', // Make the background circular
              transform: 'translateY(-50%)',
              color: '#333',
              cursor: 'pointer',
            }}
            onClick={handleSearch} // Allowing the icon to trigger the search
          />
        </div>
      </form>

      {/* Render loading state */}
      {loading && <p>Loading...</p>}

      {/* Render error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Render search results */}
      {patientData && (
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '3px solid #ddd', fontFamily: 'Verdana', padding: '8px' }}>ID</th>
                <th style={{ border: '3px solid #ddd', fontFamily: 'Verdana', padding: '8px' }}>Name</th>
                <th style={{ border: '3px solid #ddd', fontFamily: 'Verdana', padding: '8px' }}>DOB/Age</th>
                <th style={{ border: '3px solid #ddd', fontFamily: 'Verdana', padding: '8px' }}>Mobile</th>
                <th style={{ border: '3px solid #ddd', fontFamily: 'Verdana', padding: '8px' }}>Reg Date</th>
                <th style={{ border: '3px solid #ddd', fontFamily: 'Verdana', padding: '8px' }}>Address</th>
                <th style={{ border: '3px solid #ddd', fontFamily: 'Verdana', padding: '8px' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr style={{
                  backgroundColor: '#bbbbdf', // Light grey background
                  borderBottom: '1px solid #fcfcfc', // White bottom border
                }}>
                <td style={{ border: '1px solid #ddd',fontFamily: 'Verdana', padding: '6px' }}>{patientData.unique_id}</td>
                <td style={{ border: '1px solid #ddd',fontFamily: 'Verdana', padding: '6px' }}>{`${patientData.firstname} ${patientData.lastName}`}</td>

                <td className="left-align" style={{ fontFamily: 'Verdana' }}>
                  {patientData.ageDetails.dob ? (
                    formatDate(patientData.ageDetails.dob) +
                    (patientData.ageDetails.ageYear > 0 ? ` / ${patientData.ageDetails.ageYear}y` : '') +
                    (patientData.ageDetails.ageMonth > 0 ? `/ ${patientData.ageDetails.ageMonth}m` : '') +
                    (patientData.ageDetails.ageDay > 0 ? ` / ${patientData.ageDetails.ageDay}d` : '')
                  ) : (
                    'N/A' // Handle the case where DOB is also not available
                  )}
                </td>

                <td style={{ border: '1px solid #ddd',fontFamily: 'Verdana', padding: '6px' }}>{patientData.contacts.mobile}</td>
                <td style={{ border: '1px solid #ddd', fontFamily: 'Verdana', padding: '6px' }}>
                      {formatRegDate(patientData.registrationDate)}
                       </td>
                <td style={{ border: '1px solid #ddd',fontFamily: 'Verdana', padding: '6px' }}>{patientData.adrress.city}</td>

                <td className="left-align">

                <Link to={`/op_billing/${patientData.unique_id}`}>
                      <button className="button button-quick" >
                      Quick Bill
                  </button>
                </Link>
                  
                  <Link to={`/op_checkin/${patientData.unique_id}`}>
                      <button className="button button-checkin">
                          Checkin
                      </button>
                  </Link>

                {/* More Dropdown */}
                <div style={{ display: 'inline-block', position: 'relative', marginLeft: '10px' }}>
                    <button
                      onClick={handleMouseEnter}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#191970',
                        color: 'white',
                        border: '3px solid #ccc',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      More
                    </button>

                    {showDropdown && (
                      <div ref={dropdownRef}
                        style={{
                          listStyleType: 'none',
                          padding: '06px',
                          margin: '0',
                          backgroundColor: '#fff',
                          border: '3px solid #ddd',
                          borderRadius: '5px',
                          position: 'absolute',
                          top: '40px',
                          left: '0',
                        }}
                        onMouseLeave={handleMouseLeave}
                      >

                      {/* Added padding to each menu option for spacing */}
                <div className="more-dropdown" onClick={() => alert(`Update patient ID: ${patientData.unique_id}`)}>Dashboard</div>
                <div className="more-dropdown" onClick={() => alert(`Check out patient ID: ${patientData.unique_id}`)}>Timeline</div>
                <Link to={`/ip_admission/${patientData.unique_id}`} style={{ textDecoration: 'none', color: '#333' }}>
                  <div className="more-dropdown">IP Admission</div>
                </Link>
              </div>
               )}
              </div>
                    
              </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FindPatient;
