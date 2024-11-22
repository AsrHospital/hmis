// src/modules/Reception/components/BookedAppointment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookedAppointment.css';

const BookedAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  const fetchAppointments = async (date) => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('https://hmis-production.up.railway.app/hmis/get-appointment', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        params: { date: date.toISOString().split('T')[0] }
      });
      console.log(response.data);
      setAppointments(response.data);

    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleRegisterPatient = (appointmentId) => {
    navigate(`/patient/reg`, { state: { appointmentId } });
  };

  const handleNewAppointment = () => {
    navigate('/appointment_Schedule');
  };

    // Filter appointments based on the selectedDate
    const filteredAppointments = appointments.filter(appointment => 
      appointment.appointmentDate === selectedDate.toISOString().split('T')[0]
    );

  return (
    <div className="booked-appointment-container">
      <h2 style={{ fontFamily: 'Verdana',textDecoration: 'underline', color: '#235cc4' }}>Booked  Appointments</h2>

      <button onClick={handleNewAppointment} className="new-appointment-button">
        New Appointment
      </button>
      
      <div className="date-navigation">
        <button onClick={handlePreviousDate}>&lt; Previous Day</button>
        <span>{selectedDate.toDateString()}</span>
        <button onClick={handleNextDate}>Next Day &gt;</button>
      </div>

      {loading && <p>Loading appointments...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {filteredAppointments.length > 0 ? (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Time Slot</th>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Register</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.appointmentTime === "true" ? "Time not specified" : appointment.appointmentTime}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorID}</td>
                <td>
                  <button
                    onClick={() => handleRegisterPatient(appointment.id)}
                    className="register-button"
                  >
                    Register
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments booked for this date.</p>
      )}
    </div>
  );
};

export default BookedAppointment;
