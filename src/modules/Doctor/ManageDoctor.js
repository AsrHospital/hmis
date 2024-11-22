// src/components/ManageDoctor.js
import React, { useState } from 'react';

// Dummy data for demonstration
const initialDoctors = [
  { name: 'Dr. A Sidda Reddy', loginId: 'as123', department: 'Neurology', mobile: '1234567890', email: 'as.reddy@gmail.com', speciality: 'Neuro', gender: 'Male', location: 'City A' },
  { name: 'Dr. Jane Smith', loginId: 'jane456', department: 'Cardiology', mobile: '0987654321', email: 'jane.smith@example.com', speciality: 'Cardio', gender: 'Female', location: 'City B' }
];

const ManageDoctor = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [newDoctor, setNewDoctor] = useState({ name: '', loginId: '', department: '', mobile: '', email: '', speciality: '', gender: '', location: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    setDoctors([...doctors, newDoctor]);
    setNewDoctor({ name: '', loginId: '', department: '', mobile: '', email: '', speciality: '', gender: '', location: '' });
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.loginId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.mobile.includes(searchQuery)
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>Manage Doctor</h1>
      
      <form onSubmit={handleAddDoctor}>
        <h2>Add New Doctor</h2>
        <input type="text" name="name" value={newDoctor.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="text" name="loginId" value={newDoctor.loginId} onChange={handleInputChange} placeholder="Login ID" required />
        <input type="text" name="department" value={newDoctor.department} onChange={handleInputChange} placeholder="Department" required />
        <input type="text" name="mobile" value={newDoctor.mobile} onChange={handleInputChange} placeholder="Mobile" required />
        <input type="email" name="email" value={newDoctor.email} onChange={handleInputChange} placeholder="Email" required />
        <input type="text" name="speciality" value={newDoctor.speciality} onChange={handleInputChange} placeholder="Speciality" required />
        <input type="text" name="gender" value={newDoctor.gender} onChange={handleInputChange} placeholder="Gender" required />
        <input type="text" name="location" value={newDoctor.location} onChange={handleInputChange} placeholder="Location" required />
        <button type="submit">Add</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Name, Login ID, or Mobile"
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        />

<h2>Doctor List</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
  <tr>
    <th style={{ textAlign: 'left' }}>Name</th>
    <th style={{ textAlign: 'left' }}>Login ID</th>
    <th style={{ textAlign: 'left' }}>Department</th>
    <th style={{ textAlign: 'left' }}>Mobile</th>
    <th style={{ textAlign: 'left' }}>Email</th>
    <th style={{ textAlign: 'left' }}>Speciality</th>
    <th style={{ textAlign: 'left' }}>Gender</th>
    <th style={{ textAlign: 'left' }}>Location</th>
  </tr>
</thead>
          <tbody>
            {filteredDoctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.name}</td>
                <td>{doctor.loginId}</td>
                <td>{doctor.department}</td>
                <td>{doctor.mobile}</td>
                <td>{doctor.email}</td>
                <td>{doctor.speciality}</td>
                <td>{doctor.gender}</td>
                <td>{doctor.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDoctor;
