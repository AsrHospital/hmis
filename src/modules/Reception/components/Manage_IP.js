// src/modules/Reception/components/Manage_IP.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checked_In.css'; // Add a CSS file for styling

const Manage_IP = () => {
  const [IpDetails, setIpDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchIpData= async () => {
      try {
        const response = await axios.get('https://hmis-production.up.railway.app/hmis/get-Patient'); // Replace with your GET API URL
        setIpDetails(response.data); // Assuming the API response contains the check-in data list
        console.log(response.data);

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Error fetching check-in data');
        setLoading(false); // Set loading to false even in case of error
      }
    };

    const fetchData = async () => {
      setLoading(true); // Start loading
      await fetchIpData(); // Fetch check-in data
      setLoading(false); // Stop loading after data is fetched
    };
  
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Verdana', textDecoration: 'underline', color: '#235cc4' }}>Manage IP</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', width: '3%', border: '3px solid #ddd' }}>SL. No</th>
            <th style={{ textAlign: 'left', width: '5%', border: '3px solid #ddd' }}>IP No</th>
            <th style={{ textAlign: 'left', width: '8%', border: '3px solid #ddd' }}>ID</th>
            <th style={{ textAlign: 'left', width: '10%', border: '3px solid #ddd' }}>Name</th>
            <th style={{ textAlign: 'left', width: '12%', border: '3px solid #ddd' }}>Age</th>
            <th style={{ textAlign: 'left', width: '12%', border: '3px solid #ddd' }}>Gender</th>

            <th style={{ textAlign: 'left', width: '10%', border: '3px solid #ddd' }}>Requested By</th>
            <th style={{ textAlign: 'left', width: '10%', border: '3px solid #ddd' }}>Duty Doctor</th>
            <th style={{ textAlign: 'left', width: '9%', border: '3px solid #ddd' }}>Type</th>
            <th style={{ textAlign: 'left', width: '4%', border: '3px solid #ddd' }}>IP Type</th>
            <th style={{ textAlign: 'left', width: '4%', border: '3px solid #ddd' }}>Admitted On</th>
            <th style={{ textAlign: 'left', width: '12%', border: '3px solid #ddd' }}>Room</th>
            <th style={{ textAlign: 'left', width: '6%', border: '3px solid #ddd' }}>Days</th>
            <th style={{ textAlign: 'left', width: '6%', border: '3px solid #ddd' }}>Bill Details</th>
          </tr>
        </thead>

        <tbody> 
          {IpDetails.length > 0 ? (
            IpDetails.map((patient, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: '#bbbbdf', // Light grey background
                  borderBottom: '3px solid #fcfcfc', // White bottom border
                }}
              >
                <td className="left-align">{index + 1}</td> {/* SL. No */}
                <td className="left-align">{patient.ip_no}</td> {/* OP No */}
                <td className="left-align">{patient.unique_id}</td> {/* ID */}
                <td className="left-align">{`${patient.firstname} ${patient.lastName}`}</td> 
                <td className="left-align">{patient.ageDetails.ageYear} years</td> 
                <td className="left-align">{patient.gender}</td> 

                <td className="left-align">{patient.requestedBy}</td>
                <td className="left-align">{patient.dutyDoctor}</td>
                <td className="left-align">{patient.type}</td>  
                <td className="left-align">{patient.Iptype}</td> 
                <td className="left-align">{patient.admission_time}</td> 
                <td className="left-align">{patient.room}</td> 
                <td className="left-align">{patient.days}</td> 
                <td className="left-align">{patient.bill_details}</td> 
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" style={{ textAlign: 'center' }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Manage_IP;
