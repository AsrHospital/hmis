// src/modules/Reception/components/Op_CheckIn.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import './Op_CheckIn.css';

const Op_CheckIn = () => {
  const { unique_id } = useParams(); 
  const [patient, setPatient] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const [formData, setFormData] = useState({
    modeVisit: '',
    purpose: '',
    consultant: '',
    referredBy: '',
    appointment: ''
  });


  const navigate = useNavigate(); 
  const token = localStorage.getItem('token');

  // Function to format the current date and time as DD/MM/YYYY, HH:MM
  const formatDateTime = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`; // Format as DD/MM/YYYY, HH:MM
  };

  

  useEffect(() => {
    const fetchPatients = async () => {
      if (!token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      } 
      try {
        const response = await axios.get('https://hmis-production.up.railway.app/hmis/get-Patient', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }); 
        const patientsList = response.data; // Assuming response data is an array of patients

        // Find the patient with the matching unique_id
        const foundPatient = patientsList.find(patient => patient.unique_id === unique_id);
        
        if (foundPatient) {
          setPatient(foundPatient); // Set the patient state if found
        } else {
          setError('Patient not found'); // Handle case when patient is not found
        }
      } catch (error) {
        setError('Error fetching patient data');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchPatients(); // Call the function to fetch patient data
  }, [unique_id, token]); // Dependency array ensures it runs when unique_id changes

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleCheckIn = async () => {
    if (!token) {
      setError('User not authenticated.');
      return;
    }
    // Update checkin_time before submission
    const currentDateTime = formatDateTime(); // Format current date and time again if needed

    const checkInData = {
      ...formData,
      checkin_time: currentDateTime
    };

    console.log('Check-In Data:', checkInData); // Log the data to be sent

    try {
      const response = await axios.post(`https://hmis-production.up.railway.app/hmis/add-op-patient/${patient._id}`, checkInData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      } );

      console.log('Check-in successful:', response.data);
      navigate('/patient/checked_in', { state: { ...formData, patient } });
    } catch (error) {
      console.error('Check-in error:', error.response ? error.response.data : error.message);
      setError('Error during check-in. Please try again.'); // Set error message for API failure
    }
  };


  return (
    <div className="container">
      <h2 className="title">OP Check-in</h2>
      
      {loading && <p>Loading patient details...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
      
      {patient && (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

          <div style={{ margin: '10px', width: '30%' }}>
            <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>ID</strong></p>
            <div className="display-field">{patient.unique_id} </div>
          </div>

          <div style={{ margin: '10px', width: '30%' }}>
            <p><strong>Name</strong></p>
            <div className="display-field">{patient.firstname} {patient.lastName}</div>
          </div>

          <div style={{ margin: '10px', width: '30%' }}>
            <p><strong>Mobile</strong></p>
            <div className="display-field"> {patient.contacts.mobile} </div>
          </div>
        </div>
      )}

      {/* New Row for Mode of Visit, Purpose, and Consultant */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

        <div style={{ margin: '10px', width: '30%' }}>
          <p><strong>Mode of Visit</strong></p>
          <select
            name="modeVisit"
            onChange={handleInputChange}
            value={formData.modeVisit}
            className="select-field"
          >
            <option value="">Select Mode of Visit</option>
            <option value="consultation">Consultation</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="master_check">Master Health Checkup</option>
            <option value="oth">Others</option>
          </select>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
          <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Purpose</strong></p>
          <select
            name="purpose"
            onChange={handleInputChange}
            value={formData.purpose}
            className="select-field"
          >
            <option value="">Select Purpose</option>
            <option value="consultation">Consultation</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="follow-up">Follow-up</option>
          </select>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
          <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Consultant</strong></p>
          <select
            name="consultant"
            onChange={handleInputChange}
            value={formData.consultant}
            className="select-field"
          >
            <option value="">Select Consultant</option>
            <option> Dr. A SiddaReddy</option>
            <option> Dr.Abir Lal Nath</option>
            <option> Dr. SreeRam</option>
            <option> Dr. Debadatta Saha</option>

            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div>
      </div>

      {/* New Row for Referred By, Check-In Time, and Appointments */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>   
        <div style={{ margin: '10px', width: '30%' }}>
          <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Referred By</strong></p>
          <select
            name="referredBy"
            onChange={handleInputChange}
            value={formData.referredBy}
            className="select-field"
          >
            <option value="">Select Referred By</option>
            <option> Dr. A SiddaReddy</option>
            <option> Dr.Abir Lal Nath</option>
            <option> Dr. SreeRam</option>
            <option> Dr. Debadatta Saha</option>

            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
          <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Check-In Time</strong></p>
          <div className="display-field">
            {formatDateTime()} {/* Display formatted check-in time */}
          </div>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
          <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Appointments</strong></p>
          <input
            type="text"
            name="appointment"
            onChange={handleInputChange}
            value={formData.appointment}
            placeholder="Enter Appointment Details"
            className="input-field"
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '20px' }}>
        <button
          onClick={handleCheckIn}
          className="check-in-button"
        >
          Check In
        </button>
      </div>
    </div>
  );
};

export default Op_CheckIn;
