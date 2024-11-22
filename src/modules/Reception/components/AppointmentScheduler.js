// src/modules/Reception/components/AppointmentScheduler.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './AppointmentScheduler.css';

const AppointmentScheduler = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    patientName: '',
    selectedDoctor: '',
    appointmentDate: new Date(),
    appointmentTime: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrorMessage('');
  };

  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      appointmentDate: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientName || !formData.selectedDoctor || !formData.appointmentTime) {
      setErrorMessage('Please complete all fields');
      return;
    }

    // Structure data for submission
    const appointmentData = {
      patientName: formData.patientName,
      doctorID: formData.selectedDoctor,
      appointmentDate: formData.appointmentDate.toISOString().split('T')[0], // Formatting the date
      appointmentTime: formData.appointmentTime,
    };

    console.log('Form Data:', appointmentData);
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post('https://hmis-production.up.railway.app/hmis/add-appointment', appointmentData, { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Appointment scheduled successfully!');
      navigate('/booked-appointments');
    } catch (error) {
      console.error('Error scheduling appointment', error);
      setErrorMessage('Failed to schedule appointment');
    }
  };

  return (
    <div className="appointment-scheduler-container">
      <h2 style={{ fontFamily: 'Georgia',textDecoration: 'underline', color: '#235cc4' }}>Schedule an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
        </div>

        <div className="form-group">
          <label>Select Doctor</label>
          <select
            name="selectedDoctor"
            value={formData.selectedDoctor}
            onChange={handleChange}
            required
          >
            <option value="">Select a doctor</option>
            <option value="Dr. A Siddareddy">Dr. A Siddareddy</option>
            {/* <option value="Abir Lal Nath">Abir Lal Nath</option>
            <option value="SreeRam">SreeRam</option>
            <option value="Debadatta Saha">Debadatta Saha</option> */}
          </select>
        </div>

        <div className="form-group calendar-group">
          <label>Select Date</label>
          <Calendar onChange={handleDateChange} value={formData.appointmentDate} className="calendar-component" 
                    minDate={new Date()}/> 
        </div>

        <div className="form-group">
          <label>Select Time Slot</label>
          <select
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          >
            <option value="">Select a time slot</option>
            <option value="4:00 PM - 4:20 PM">4:00 PM - 4:20 PM</option>
            <option value="4:20 PM - 4:40 PM">4:20 PM - 4:40 PM</option>
            <option value="4:40 PM - 5:00 PM">4:40 PM - 5:00 PM</option>
            <option value="5:00 PM - 5:20 PM">4:40 PM - 5:00 PM</option>
            <option value="5:20 PM - 5:40 PM">4:40 PM - 5:00 PM</option>
          </select>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit">Schedule Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentScheduler;
