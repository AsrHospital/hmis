// src/modules/Reception/components/PurposeSelection.js
import './PurposeSelection.css';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Update to useNavigate

const PurposeSelection = () => {
  const navigate = useNavigate(); // Use navigate instead of useHistory
  const { unique_id } = useParams(); // Fetch the unique_id from the URL

  const handlebill= () => {
    navigate(`/op_billing/${unique_id}`); 
  };

  const handleCheckIn = () => {
    navigate(`/op_checkin/${unique_id}`); 
  };

  const handleIp = () => {
    navigate(`/ip_admission/${unique_id}`);
  };


  return (
    <div>
      <h2 className="heading" style={{ textAlign: 'center', fontFamily: 'Verdana',textDecoration: 'underline', color: '#235cc4' }}>Select Purpose</h2>
      {/* Display the unique ID */}
    <p style={{ textAlign: 'center', fontFamily: 'Verdana',fontSize: '20px' }}>Patient Registration ID: <strong>{unique_id}</strong></p>

      <div className="button-container">
      <button className="bill-button" onClick={handlebill}>
          Quick Bill
        </button>
        <button className="checkin-button" onClick={handleCheckIn}>
          Check In
        </button>
        <button className="ip-admission-button" onClick={handleIp}>
          IP Admission
        </button>
        <button className="appointment-button" onClick={handleIp}>
          Appointment
        </button>
      </div>
    </div>
  );
};

export default PurposeSelection;
