// src/App.js
import React, {} from 'react';
import { Routes, Route } from 'react-router-dom'; // set BrowserRouter in index.js

import Login from './modules/Auth/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import PatientForm from './modules/Reception/components/PatientForm';
import FindPatient from './modules/Reception/components/FindPatient';
import PurposeSelection from './modules/Reception/components/PurposeSelection';  
import OpCheckIn from './modules/Reception/components/OpCheckIn';  
import CheckedIn from './modules/Reception/components/CheckedIn';
import IpAdmission from './modules/Reception/components/IpAdmission';   
import ManageIP from './modules/Reception/components/ManageIP';   
import AppointmentScheduler from './modules/Reception/components/AppointmentScheduler';   
import BookedAppointment from './modules/Reception/components/BookedAppointment';
import OpBill from './modules/Reception/components/OpBill';


import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route element={<ProtectedRoute />}>

        {/* Layout-wrapped routes */}
        <Route element={<Layout />}>
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/patient/reg" element={ <PatientForm />} />
        <Route path="/findPatient" element={<FindPatient/>} />
        <Route path="/select-purpose/:unique_id" element={ <PurposeSelection /> } />
        <Route path="/op_checkin/:unique_id" element={<OpCheckIn />  } />
        <Route path="/patient/checked_in" element={ <CheckedIn />} />
        <Route path="/appointment_Schedule" element={<AppointmentScheduler /> } />
        <Route path="/booked-appointments" element={<BookedAppointment />} />
        <Route path="/op_billing/:unique_id" element={<OpBill />} />
        <Route path="/ip_admission/:unique_id" element={<IpAdmission /> } />
        <Route path="/patient/manage_ip" element={<ManageIP />} />
        </Route>
        </Route>
      </Routes>

    </div>
    
  );
};


export default App;
