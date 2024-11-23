// src/modules/Reception/components/Ip_Admission.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed and imported
import './Ip_Admission.css';

const Ip_Admission = () => {
  const { unique_id } = useParams(); // Fetch the unique_id from the URL
  const [patient, setPatient] = useState(null); // State to store patient details
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  const [formData, setFormData] = useState({
    dutyDoctor: '',
    Iptype:'',
    purpose:'',
    room: '',
    roomtype:'',
    consultant: '',
    otherConsultant:'',
    referredBy: '',
    creditProvider:'',
    AttenderName:'',
    AttenderMobile:'',
    advance:'',
    paymentType:'',
    instruction:''
  });

  const navigate = useNavigate(); // To redirect to the checked_in page

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
      try {
        const response = await axios.get('https://hmis-production.up.railway.app/hmis/get-Patient'); // API endpoint to get all patients
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
  }, [unique_id]); // Dependency array ensures it runs when unique_id changes

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleIp = async () => {
    // Update checkin_time before submission
    const currentDateTime = formatDateTime(); // Format current date and time again if needed
    const IpData = {
      ...formData,
      admission_time: currentDateTime,
    };

    console.log('IP Data:', IpData); // Log the data to be sent

    try {
      const response = await axios.post(`https://hmis-production.up.railway.app/hmis/add-ip-admission/${patient._id}`, IpData);
      console.log('Ip-Admission successful:', response.data);
      navigate('/patient/manage_ip', { state: { ...formData, patient } });
    } catch (error) {
      console.error('Ip-Admission error:', error.response ? error.response.data : error.message);
      setError('Error during check-in. Please try again.'); // Set error message for API failure
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center',fontFamily: 'Verdana', textDecoration: 'underline', color: '#235cc4' }}>IP-Admission</h2>
      
      {loading && <p>Loading patient details...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
      
      {patient && (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ margin: '10px', width: '30%' }}>
            <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>ID</strong></p>
            <div style={{ border: '2px solid #1c1a1a', borderRadius: '8px', fontSize: '18px', padding: '10px', backgroundColor: '#ede8e8' }}>
              {patient.unique_id} 
            </div>
          </div>
          <div style={{ margin: '10px', width: '30%' }}>
            <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Name</strong></p>
            <div style={{ border: '2px solid #1c1a1a', borderRadius: '8px', fontSize: '18px', padding: '10px', backgroundColor: '#ede8e8' }}>
              {patient.firstname} {patient.lastName}
            </div>
          </div>
          <div style={{ margin: '10px', width: '30%' }}>
            <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Mobile</strong></p>
            <div style={{ border: '2px solid #1c1a1a', borderRadius: '8px', fontSize: '18px', padding: '10px', backgroundColor: '#ede8e8' }}>
              {patient.contacts.mobile}
            </div>
          </div>
        </div>
      )}

      {/* Row 2 ----------------------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

      <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>IP Type</strong>
          <input
            type="text"
            name="Iptype"
            onChange={handleInputChange}
            value={formData.Iptype}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          />
        </div></div>

        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>Consultant</strong>
          <select
            name="consultant"
            onChange={handleInputChange}
            value={formData.consultant}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
            <option value="">Select Consultant</option>
            <option> Dr. A. Sidda Reddy </option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div></div>
  
        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>Referred By</strong>
          <select
            name="referredBy"
            onChange={handleInputChange}
            value={formData.referredBy}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
            <option value="">Select Referred By</option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div></div>

        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>Duty Doctor</strong>
          <select
            name="dutyDoctor"
            onChange={handleInputChange}
            value={formData.dutyDoctor}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
             <option value="">Select--</option>
             <option> Dr. Rakesh Das </option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div></div>
        </div>
      
      {/* Row 3 ----------------------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>Other Consultant</strong>
          <select
            name="otherConsultant"
            onChange={handleInputChange}
            value={formData.otherConsultant}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
            <option value="">Select Consultant</option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div></div>

        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>Admission Time</strong>
          <div style={{ border: '2px solid #1c1a1a', borderRadius: '8px', fontSize: '18px', padding: '10px', backgroundColor: '#ede8e8' }}>
            {formatDateTime()} {/* Display formatted check-in time */}
          </div></div>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong> Room </strong>
          <select
            name="room"
            onChange={handleInputChange}
            value={formData.room}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
            <option value="">Select Room</option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div></div>
        

        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong> Room Type</strong>
          <select
            name="roomtype"
            onChange={handleInputChange}
            value={formData.roomtype}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
            <option value="">none</option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div></div>
        </div>

      {/* Row 4  ----------------------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

      <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>Purpose</strong>
          <select
            name="purpose"
            onChange={handleInputChange}
            value={formData.purpose}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
            <option value="">Select Purpose</option>
            <option value="consultation">Consultation</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="follow-up">Follow-up</option>
          </select>
        </div></div>

      <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong> Credit Provider</strong>
          <select
            name="creditProvider"
            onChange={handleInputChange}
            value={formData.creditProvider}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
            <option value="">none</option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div></div>

        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>Attender Name </strong>
          <input
            type="text"
            name="AttenderName"
            onChange={handleInputChange}
            value={formData.AttenderName}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          />
        </div></div>
      

        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'left', fontSize: '18px' }}><strong>Attender Phone</strong>
          <input
            type="text"
            name="AttenderMobile"
            onChange={handleInputChange}
            value={formData.AttenderMobile}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          />
        </div></div>
        </div>

        {/* Row  5 ----------------------------- */}

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'center', fontSize: '18px' }}><strong>Advance</strong>
          <input
            type="number"
            name="advance"
            onChange={handleInputChange}
            value={formData.advance}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          />
        </div></div>
        
        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'center', fontSize: '18px' }}><strong> Payment Type</strong>
          <select
            name="paymentType"
            onChange={handleInputChange}
            value={formData.paymentType}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          >
            <option value="">Select Payment Type</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="cheque">Cheque</option>
            <option value="dd">DD</option>
            <option value="neft">Neft</option>
            <option value="upi">UPI</option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div></div>
        
        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ textAlign: 'center', fontSize: '18px' }}><strong> Instruction </strong>
          <input
            type="number"
            name="instruction"
            onChange={handleInputChange}
            value={formData.instruction}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
          />
        </div></div>
        </div>


      <div style={{ textAlign: 'center', margin: '20px' }}>
        <button
          onClick={handleIp}
          className="submit-button"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Ip_Admission;
