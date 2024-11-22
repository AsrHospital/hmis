// src/modules/Reception/components/PatientForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientForm.css'; 
import states from './states';
import axios from '../../../utils/axiosConfig';

const PatientForm = () => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    firstname: '',
    lastName: '',
    registrationDate: getCurrentDateTime(),
    gender: '',
    bloodGroup: '',
    adrress: {
      city: '',
      area: '',
      state: '',
      pin: '',
      street: '',
      landmark: '',
      gurdianDetails: {
        gurdianName: '',
        gurdianMobile: '',
        gurdianAddress: ''
      },
      country: 'India'
    },
    ageDetails: {
      dob: '',
      ageYear: '',
      ageMonth: '',
      ageDay: ''
    },
    contacts: {
      email: '',
      mobile: '',
      whatsapp: ''
    },
    patientsIds: {
      idProof: '',
      idProofDetails: ''
    },
    location: 'Institute Of Neuro Science, (Kunjaban, Agartala)',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value
      }
    }));
  };

  const handleGuardianChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      adrress: {
        ...prevState.adrress,
        gurdianDetails: {
          ...prevState.adrress.gurdianDetails,
          [field]: value
        }
      }
    }));
  };

  // Automatically fill WhatsApp field when mobile number is entered
  const handleMobileChange = (e) => {
    const value = e.target.value;
    const isMobileField = e.target.name === 'mobile';
    
    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        mobile: value,
        whatsapp: isMobileField && !prev.contacts.whatsappManuallyEdited ? value : prev.contacts.whatsapp
      },
    }));

    if (isMobileField && value === '') {
      setFormData(prev => ({
        ...prev,
        contacts: {
          ...prev.contacts,
          whatsapp: '',
          whatsappManuallyEdited: false
        }
      }));
    }

    setErrorMessage('');
  };

  const handleWhatsAppChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        whatsapp: value,
        whatsappManuallyEdited: true
      },
    }));
  };

  const handleAgeCalculation = (name, value) => {
    if (name === 'dob') {
      const dobDate = new Date(value);
      const today = new Date();
      const ageYear = today.getFullYear() - dobDate.getFullYear();
      const monthDifference = today.getMonth() - dobDate.getMonth();
      const age = monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate()) ? ageYear - 1 : ageYear;
      
      setFormData(prevData => ({
        ...prevData,
        ageDetails: {
          ...prevData.ageDetails,
          dob: value,
          ageYear: age,
          ageMonth: (monthDifference + 12) % 12,
          ageDay: today.getDate() - dobDate.getDate()
        }
      }));
    }

    if (name === 'ageYear') {
      const age = parseInt(value);
      if (!isNaN(age)) {
        const dobDate = new Date();
        dobDate.setFullYear(dobDate.getFullYear() - age);
        setFormData(prevData => ({
          ...prevData,
          ageDetails: {
            ...prevData.ageDetails,
            dob: dobDate.toISOString().split('T')[0]
          }
        }));
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Validation for Date of Birth or Age Year
    if (!formData.ageDetails.dob && !formData.ageDetails.ageYear) {
      setErrorMessage('Please enter either Date of Birth or Age Year.');
      return;
    }

    try {
      const res = await axios.post("https://hmis-production.up.railway.app/hmis/add-Patient", formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert("User Registered Successfully!");
      const unique_id = res.data.unique_id; // Ensure this is correct based on your API response structure
      navigate(`/select-purpose/${unique_id}`);
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage('Failed to register. Please try again.');
    }
  };



  return (
    <div className="patient-form-container">
      <h1 style={{ textAlign: 'center', fontFamily: 'Arial',textDecoration: 'underline', color: '#235cc4' }}>Register Patient</h1>
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-section">

          {/* Basic Information */}
          <h3>Basic Information-----</h3>
          <div className="form-field">
            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} readOnly />

            <label>Country</label>
            <input type="text" name="adrress.country" value={formData.adrress.country} onChange={handleChange} readOnly />

            <label>How do you know us?</label>
            <select name="source" value={formData.gender} onChange={handleChange} >
              <option value="">Select a Source</option>
              <option value="doctor">Doctor</option>
              <option value="email">Email</option>
              <option value="banner_hoardings">Banner/Hoardings</option>
              <option value="sms">SMS</option>
              <option value="paper">Paper</option>
              <option value="searchengine">Search Engine</option>
              <option value="friendsfamily">Friends/Family</option>
              <option value="flyers">Flyers</option>
              <option value="oldpatient">Old Patient Reference</option>
            </select>

            <label>Reference Details</label>
            <input type="text" name="referenceDetails" value={formData.referenceDetails} onChange={handleChange} placeholder="Reference details" />
          </div>

          <div className="form-field">
            <label>Mobile<span className="required-asterisk">*</span></label>
            <input type="number" name="mobile" value={formData.contacts.mobile} 
            onChange={handleMobileChange} 
            placeholder="Mobile number"  maxLength="10"/>

            <label>Whatsapp</label>
            <input type="number" name="whatsapp" value={formData.contacts.whatsapp} 
            onChange={handleWhatsAppChange} 
            maxLength="10" />

            <label>First Name<span className="required-asterisk">*</span></label>
            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First name" />

            <label>Last Name<span className="required-asterisk">*</span></label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
          </div>

          <div className="form-field">
            <label>Gender<span className="required-asterisk">*</span></label>
            <select name="gender" value={formData.gender} onChange={handleChange} required-asterisk>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label>Registration Date</label>
            <input type="datetime-local" name="registrationDate" value={formData.registrationDate} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>DOB</label>
            <input type="date" name="dob" value={formData.ageDetails.dob} 
            onChange={(e) => { handleNestedChange('ageDetails', 'dob', e.target.value); handleAgeCalculation('dob', e.target.value); }} />

            <label>Age<span className="required-asterisk">*</span></label>
            <input type="number" name="ageYear" value={formData.ageDetails.ageYear} 
            onChange={(e) => handleAgeCalculation('ageDetails','ageYear', e.target.value)} placeholder="Years" min="0" />

            <input type="number" name="ageMonth" value={formData.ageDetails.ageMonth} 
            onChange={(e) => handleNestedChange('ageDetails', 'ageMonth', e.target.value)} placeholder="Months" min="0" />

            <input type="number" name="ageDay" value={formData.ageDetails.ageDay} 
            onChange={(e) => handleNestedChange('ageDetails', 'ageDay', e.target.value)} placeholder="Days" min="0" />
          </div>

          <div className="form-field">
            <label>Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} >
              <option value="">Select Blood Group</option>
              {[
                'O+', 'O-', 'A+', 'A-', 'A1+', 'A1-', 'B+', 'B-', 'B1+', 'B1-', 
                'AB+', 'AB-', 'A1B+', 'A1B-', 'A2B+', 'A2B-'
              ].map((group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <label>ID Proof</label>
            <select name="idProof" value={formData.patientsIds.idProof} 
            onChange={(e) => handleNestedChange('patientsIds', 'idProof', e.target.value)}>
              <option value="">Select Any</option>
              <option value="adhar">Adhar</option>
              <option value="pan">PAN</option>
              <option value="driving_license">Driving License</option>
              <option value="voter_id">Voter I-card</option>
              <option value="passport">Passport</option>
              <option value="other">Other</option>
            </select>

            <label>ID Proof Details</label>
            <input type="text" name="idProofDetails" value={formData.patientsIds.idProofDetails} 
            onChange={(e) => handleNestedChange('patientsIds', 'idProofDetails', e.target.value)} placeholder="ID Proof Details" />

            <label>Email</label>
            <input type="email" name="email" value={formData.contacts.email} 
            onChange={(e) => handleNestedChange('contacts', 'email', e.target.value)}  placeholder="Email address"  />
          </div>
        </div>

        <div className="form-flex-container">
          {/* Patient Address Details */}
          <div className="form-section address-section">
            <h3>Address Details-----</h3>
            <div className="form-field">
              <label>Street</label>
              <input type="text" name="street" value={formData.adrress.street} 
              onChange={(e) => handleNestedChange('adrress', 'street', e.target.value)}  placeholder="Street" />

              <label>Area</label>
              <input type="text" name="area" value={formData.adrress.area} 
              onChange={(e) => handleNestedChange('adrress', 'area', e.target.value)} placeholder="Area" />

              <label>Landmark</label>
              <input type="text" name="landmark" value={formData.adrress.landmark} 
              onChange={(e) => handleNestedChange('adrress', 'landmark', e.target.value)}  placeholder="Landmark" />
            </div>

            <div className="form-field">
              <label>City</label>
              <input type="text" name="city" value={formData.adrress.city} 
              onChange={(e) => handleNestedChange('adrress', 'city', e.target.value)}  placeholder="City" />

              <label>State</label>
              <select name="state" value={formData.adrress.state} 
              onChange={(e) => handleNestedChange('adrress', 'state', e.target.value)}  >
                <option value="">Select State/UT</option>
                {states.map((state, index) => (
                <option key={index} value={state}>
                {state}
                </option>
                ))}
              </select>
              
              <label>Pin/Zip:</label>
              <input type="number" name="pin" value={formData.adrress.pin} 
              onChange={(e) => handleNestedChange('adrress', 'pin', e.target.value)}  placeholder="Enter Pin/Zip"/>
            </div>
          </div>

          {/* Guardian Details */}
          <div className="form-section guardian-section">
            <h3>Guardian Details-----</h3>
            <div className="form-field">

              <label>Guardian Name</label>
              <input type="text" name="gurdianName" value={formData.adrress.gurdianDetails.gurdianName} 
              onChange={(e) => handleGuardianChange('gurdianName', e.target.value)}
              placeholder="Guardian's Name" />

              <label>Guardian Mobile</label>
              <input type="number" name="gurdianMobile" value={formData.adrress.gurdianDetails.gurdianMobile} 
              onChange={(e) => handleGuardianChange('gurdianMobile', e.target.value)}
              placeholder="Mobile" maxLength="10"/>

              <label>Guardian Address</label>
              <input type="text" name="gurdianAddress" value={formData.adrress.gurdianDetails.gurdianAddress} 
              onChange={(e) => handleGuardianChange('gurdianAddress', e.target.value)}
              placeholder="Address" />
            </div>
          </div>
        </div>

        {/* Error Message Display */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}


        <div className="submit-group">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
