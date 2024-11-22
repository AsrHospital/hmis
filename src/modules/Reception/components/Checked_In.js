// src/modules/Reception/components/Checked_In.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Checked_In.css'; // Add a CSS file for styling

const Checked_In = () => {
  const [checkInDetails, setCheckInDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(null); // State to manage the visibility of the actions menu
  // const [opRecords, setOpRecords] = useState([]);
  const menuRef = useRef(null); // Create a ref for the menu

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {

    const fetchCheckInData = async () => {
      try {
        const response = await axios.get('https://hmis-production.up.railway.app/hmis/get-Patient',{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        } ); 
        setCheckInDetails(response.data); // Assuming the API response contains the check-in data list
        console.log(response.data);

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Error fetching check-in data');
        setLoading(false); // Set loading to false even in case of error
      }
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };

     // Bind the event listener
     document.addEventListener('mousedown', handleClickOutside);
     fetchCheckInData(); // Fetch check-in data
 
     return () => {
       // Unbind the event listener on cleanup
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Handle cases where the date is not available
  
    const [year, month, day] = dateString.split('-'); // Split the date string
    return `${day}-${month}-${year}`; // Return the formatted date
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Verdana',  textDecoration: 'underline', color: '#235cc4' }}>Manage OP</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', width: '3%', border: '3px solid #ddd' }}>SL. No</th>
            <th style={{ textAlign: 'left', width: '3%', border: '3px solid #ddd' }}>OP No</th>
            <th style={{ textAlign: 'left', width: '8%', border: '3px solid #ddd' }}>ID</th>
            <th style={{ textAlign: 'left', width: '10%', border: '3px solid #ddd' }}>Name</th>
            <th style={{ textAlign: 'left', width: '14%', border: '3px solid #ddd' }}>DOB/Age</th>
            <th style={{ textAlign: 'left', width: '4%', border: '3px solid #ddd' }}>Mobile</th>
            <th style={{ textAlign: 'left', width: '12%', border: '3px solid #ddd' }}>Dr</th>
            <th style={{ textAlign: 'left', width: '9%', border: '3px solid #ddd' }}>Referred By</th>
            <th style={{ textAlign: 'left', width: '4%', border: '3px solid #ddd' }}>Mode/Visit</th>
            <th style={{ textAlign: 'left', width: '3%', border: '3px solid #ddd' }}>Purpose</th>
            <th style={{ textAlign: 'left', width: '6%', border: '3px solid #ddd' }}>Check-In</th>
            <th style={{ textAlign: 'left', width: '6%', border: '3px solid #ddd' }}>Session /Token</th>
            <th style={{ textAlign: 'left', width: '6%', border: '3px solid #ddd' }}>Bill Details</th>
            <th style={{ textAlign: 'left', width: '6%', border: '3px solid #ddd' }}>Actions</th>

          </tr>
        </thead>

        <tbody> 
          {checkInDetails.length > 0 ? (
            checkInDetails.map((patient, index) => {

              const lastOpRecord = patient.opRecords && patient.opRecords.length > 0 
              ? patient.opRecords[patient.opRecords.length - 1] // Assuming the last opRecord is the latest
              : null;
              
              return (
              <tr
                key={index}
                style={{
                  backgroundColor: '#bbbbdf', // Light grey background
                  borderBottom: '3px solid #fcfcfc', // White bottom border
                }}
              >
                <td className="left-align">{index + 1}</td> 
                <td className="left-align">{patient.opd_no}</td> 
                <td className="left-align">{patient.unique_id}</td> 
                <td className="left-align">{`${patient.firstname} ${patient.lastName}`}</td> 

                <td className="left-align">
                  {patient.ageDetails.dob ? (
                    formatDate(patient.ageDetails.dob) +
                    (patient.ageDetails.ageYear > 0 ? ` / ${patient.ageDetails.ageYear}y` : '') +
                    (patient.ageDetails.ageMonth > 0 ? `/ ${patient.ageDetails.ageMonth}m` : '') +
                    (patient.ageDetails.ageDay > 0 ? ` / ${patient.ageDetails.ageDay}d` : '')
                  ) : (
                    'N/A' // Handle the case where DOB is also not available
                  )}
                </td>
                <td className="left-align">{patient.contacts.mobile}</td>
                
                <td className="left-align">{lastOpRecord?.consultant || 'N/A'}</td>
                <td className="left-align">{lastOpRecord?.referredBy || 'N/A'}</td>
                <td className="left-align">{lastOpRecord?.modeVisit || 'N/A'}</td>
                <td className="left-align">{lastOpRecord?.purpose || 'N/A'}</td>
                <td className="left-align">{lastOpRecord?.checkin_time || 'N/A'}</td>

                <td className="left-align">{patient.session_token || 'N/A'}</td>


                <td className="left-align">
                ₹{patient.billDetails} 
                <button 
                  onClick={() => navigate(`/op_billing/${patient.unique_id}`)} 
                  style={{
                    marginLeft: '10px', 
                    padding: '5px 10px', 
                    backgroundColor: '#008080', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer'
                  }}>
                  Quick Bill
                </button>
                </td>
              
            {/* Actions Menu */}
            <td className="left-align">
                  <div style={{ display: 'inline-block', position: 'relative' }} ref={menuRef}>
                    <span
                      style={{ marginLeft: '10px', padding: '5px', cursor: 'pointer', fontSize: '25px' }}  // font size of the three-dot menu icon
                      onClick={() => setShowMenu(index === showMenu ? null : index)}
                    >
                      &#x22EE; {/* Three-dot menu icon */}
                    </span>
                    {showMenu === index && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: '0',
                          backgroundColor: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          zIndex: '1',
                        }}
                      >
                         {/* Added padding to each menu option for spacing */}
                    <div className="menu-option" onClick={() => alert(`Update patient ID: ${patient.id}`)}>Update</div>
                    <div className="menu-option" onClick={() => alert(`Check out patient ID: ${patient.id}`)}>Check out</div>
                    <div className="menu-option" onClick={() => alert(`IP Admission for patient ID: ${patient.id}`)}>IP Admission</div>
                    <div className="menu-option" onClick={() => alert(`Prescription for patient ID: ${patient.id}`)}>Prescription</div>
                    <div className="menu-option" onClick={() => alert(`Medical History for patient ID: ${patient.id}`)}>Medical History</div>
                  </div>
                    )}
                  </div>
                </td>

              </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="14" style={{ textAlign: 'center' }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Checked_In;
