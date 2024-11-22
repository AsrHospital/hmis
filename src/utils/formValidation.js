// utils/formValidation.js
export const isPhoneNumberValid = (phoneNo) => {
    const phoneRegex = /^[0-9]{10}$/;  // Example regex for a 10-digit phone number
    return phoneRegex.test(phoneNo);
  };
  