// // src/components/Op_CheckIn.js
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Ensure axios is installed and imported

// const formatDateTime = () => {
//   const currentDate = new Date();

//   // Get the date components
//   const day = currentDate.getDate().toString().padStart(2, '0'); // Pad single digit days
//   const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, pad single digit months
//   const year = currentDate.getFullYear(); // Get full year

//   // Get the time components
//   const hours = currentDate.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if needed
//   const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if needed

//   return `${day}/${month}/${year}, ${hours}:${minutes}`; // Format as DD/MM/YYYY, HH:MM
// };

// const Op_CheckIn = () => {
//   const { unique_id } = useParams(); // Fetch the unique_id from the URL
//   const [patient, setPatient] = useState(null); // State to store patient details
//   const [loading, setLoading] = useState(true); // State to manage loading
//   const [error, setError] = useState(null); // State to manage errors


//   const [formData, setFormData] = useState({
//     modeVisit: '',
//     purpose: '',
//     consultant: '',
//     referredBy: '',
//     checkin_time: formatDateTime(),
//     appointment: ''
//   });

//   console.log(formatDateTime());
   
//   const navigate = useNavigate(); // To redirect to the checked_in page

  
//        // Function to format the current date and time as DD/MM/YYYY, HH:MM
    
  
//       // var currentDateTime = formatDateTime(); // Call the function to get current date and time
  
//       // console.log(currentDateTime);
//       // setFormData(prevState => ({
//       //   ...prevState,
//       //   checkin_time: currentDateTime // Set the current date and time to checkin_time field
//       // })
    

//       useEffect(() => {

    

//     const fetchPatients = async () => {
//       try {
//         const response = await axios.get('https://hmis-production.up.railway.app/hmis/getPatient'); // API endpoint to get all patients
//         const patientsList = response.data; // Assuming response data is an array of patients

//         // Find the patient with the matching unique_id
//         const foundPatient = patientsList.find(patient => patient.unique_id === unique_id);
        
//         if (foundPatient) {
//           setPatient(foundPatient); // Set the patient state if found
//         } else {
//           setError('Patient not found'); // Handle case when patient is not found
//         }
//       } catch (error) {
//         setError('Error fetching patient data');
//       } finally {
//         setLoading(false); // Set loading to false after data is fetched
//       }
//     };

//         fetchPatients(); // Call the function to fetch patient data
//       }, [unique_id]); // Dependency array ensures it runs when unique_id changes

//       // Handle form input change
//       const handleInputChange = (e) => {
//         setFormData({
//           ...formData,
//           [e.target.name]: e.target.value
//         });
//       };

//   // Handle form submission
//   const handleCheckIn = async () => {
//     // Do the form submission or API request here, if needed
//     try {
//     const checkInData = {
//       unique_id: patient.unique_id, // Ensure you include the patient ID
//       modeVisit: formData.modeVisit,
//       purpose: formData.purpose,
//       consultant: formData.consultant,
//       referredBy: formData.referredBy,
//       checkin_time:formatDateTime(),
//       appointment: formData.appointment
//     };

//     const response = await axios.post('https://hmis-production.up.railway.app/hmis/addCheckInPatient', checkInData);

//     // You can handle the response here if needed
//     console.log('Check-in successful:', response.data);
//     console.log('checkin_time');


//     // Navigate to the checked_in page
//     navigate('/patient/checked_in', { state: { ...formData, patient } });
//   } catch (error) {
//     setError('Error during check-in. Please try again.'); // Set error message for API failure
//     console.error('Check-in error:', error);
//   }
// };
// console.log(formatDateTime());


//   return (
//     <div>
//       <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>OP Check-in</h2>
      
//       {loading && <p>Loading patient details...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
      
//       {patient && (
//   <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

//     <div style={{ margin: '10px', width: '30%' }}>
//       <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>ID</strong></p>
//       <div style={{ border: '2px solid #1c1a1a', borderRadius: '8px', fontSize: '18px', padding: '15px', backgroundColor: '#ede8e8' }}>
//         {patient.unique_id} 
//       </div>
//     </div>

//     <div style={{ margin: '10px', width: '30%' }}>
//       <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Name</strong></p>
//       <div style={{ border: '2px solid #1c1a1a', borderRadius: '8px', fontSize: '18px', padding: '15px', backgroundColor: '#ede8e8' }}>
//         {patient.firstname} {patient.lastName}
//       </div>
//     </div>
    
//     <div style={{ margin: '10px', width: '30%' }}>
//       <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Mobile</strong></p>
//       <div style={{ border: '2px solid #1c1a1a', borderRadius: '8px', fontSize: '18px', padding: '15px', backgroundColor: '#ede8e8' }}>
//         {patient.mobile}
//       </div>
//     </div>
//     </div>
//     )}

//         {/* New Row for Mode of Visit, Purpose, and Consultant */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          
//           <div style={{ margin: '10px', width: '30%' }}>
//             <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Mode of Visit</strong></p>
//             <select
//             name="modeVisit"
//             onChange={handleInputChange}
//             value={formData.modeVisit}
//             style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
//           >
//             <option value="">Select Mode of Visit</option>
//             <option value="consultation">Consultation</option>
//             <option value="diagnostic">Diagnostic</option>
//             <option value="master_check">Master Health Checkup</option>
//             <option value="oth">Others</option>
//           </select>
//           </div>

//           <div style={{ margin: '10px', width: '30%' }}>
//             <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Purpose</strong></p>
//             <select
//             name="purpose"
//             onChange={handleInputChange}
//             value={formData.purpose}
//             style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
//           >
//             <option value="">Select Purpose</option>
//             <option value="consultation">Consultation</option>
//             <option value="diagnostic">Diagnostic</option>
//             <option value="follow-up">Follow-up</option>
//           </select>
//           </div>

//           <div style={{ margin: '10px', width: '30%' }}>
//             <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Consultant</strong></p>
//             <select
//             name="consultant"
//             onChange={handleInputChange}
//             value={formData.consultant}
//             style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
//           >
//             <option value="">Select Consultant</option>
//             {/* Options will be dynamically fetched and populated later */}
//           </select>
//            </div>
//            </div>

//         {/* New Row for Mode of Visit, Purpose, and Consultant */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>   

//         <div style={{ margin: '10px', width: '30%' }}>
//             <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Referred By</strong></p>
//             <select
//             name="referredBy"
//             onChange={handleInputChange}
//             value={formData.referredBy}
//             style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
//           >
//             <option value="">Select Referred By</option>
//             {/* Options will be dynamically fetched and populated later */}
//           </select>
//            </div>

//             {/* Check-In Time Field (auto-fetched in DD/MM/YYYY, HH:MM format) */}


//             <div style={{ marginBottom: '15px' }}>
//           <label>Visit Mode</label><br />
//           <input 
//             type="text" 
//             name="checkin_time" 
//             onChange={handleInputChange} 
//             value={formData.checkin_time} />
//         </div>


//             {/* <div style={{ margin: '10px', width: '30%' }}>
//                 <p style={{ textAlign: 'left', fontSize: '20px' }}><strong>Check-In Time</strong></p>
//                name="checkin_time"
//                 onChange={handleInputChange}
//                 value={formData.checkin_time}
//                style={{ border: '2px solid #1c1a1a', borderRadius: '8px', padding: '15px', backgroundColor: '#ede8e8' }}> {/* Displays the auto-fetched date and time in DD/MM/YYYY, HH:MM format */}
                
            

//            <div style={{ margin: '10px', width: '30%' }}>
//             <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Appointments</strong></p>
//             <select
//             name="appointment"
//             onChange={handleInputChange}
//             value={formData.appointment}
//             style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #1c1a1a', backgroundColor: '#ebd1d1' }}
//           >
//             </select>
//            </div>  
//            </div>


//     {/* Check-In Button */}
//     <div style={{ margin: '20px 0', textAlign: 'center' }}>
//         <button
//         onClick={handleCheckIn}
//         style={{ padding: '10px 20px', fontSize: '18px', borderRadius: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
//         >
//         Check-In
//         </button>
//     </div>
//     </div>
//     );
//     };


// export default Op_CheckIn;
