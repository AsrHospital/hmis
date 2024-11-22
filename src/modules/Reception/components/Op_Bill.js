// src/modules/Reception/components/Op_Bill.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import './Op_Bill.css';
import { jsPDF } from 'jspdf';
// import { useReactToPrint } from 'react-to-print';

const Op_Bill = () => {
    const { unique_id } = useParams(); 
    const [patient, setPatient] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    
  
    const [formData, setFormData] = useState({
      provider: '',
      consultant:'',
      referredBy: '',
      modeVisit:'',

      particulars:'',
      qty:'1',
      price:'',
      tax:'0',
      itemDisc_percent:'0',
      itemDisc_amount:'0',

      finalAmount:'0',
      disc_percent:'0',
      disc_amount:'0',
      amount_receivable: '0',
      amount_received:'0',

      pay_mode:'single',
      pay_type:'',
      additional_note:'',
    });

    const [items, setItems] = useState([]);

    const navigate = useNavigate(); 
    const token = localStorage.getItem('token');

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
        const patientsList = response.data;

        const foundPatient = patientsList.find(patient => patient.unique_id === unique_id);

        if (foundPatient) {
            setPatient(foundPatient); 
          } else {
            setError('Patient not found'); 
          }
        } catch (error) {
          setError('Error fetching patient data');
        } finally {
          setLoading(false); 
        }
      };
  
      fetchPatients(); 
    }, [unique_id, token]); 

    
const handlePriceChange = (e) => {
      const { name, value } = e.target;
    
      let updatedPrice = "";
      if (name === "particulars") {
        // Extract the price from the selected value (if it exists)
        const match = value.match(/- Rs\. (\d+)/); // Match pattern "- Rs. {price}"
        updatedPrice = match ? match[1] : ""; // Extract price if match found
      }
      setFormData((prevData) => {
        const qty = parseInt(prevData.qty || 1); // Default qty to 1
        const price = updatedPrice || 0; // Use updated price or default to 0

        return {
            ...prevData,
            [name]: value,
            price: name === "particulars" ? price : prevData.price, // Update price only if particulars is selected
            total: (price * qty).toFixed(2), // Set total as price * qty initially
        };
    });
};


const handleInputChange = (e) => {
      const { name, value } = e.target;
    
      let updatedValue = value;
      
      // For numeric fields, handle the conversion properly
      if (name === "qty" || name === "tax" || name === "itemDisc_percent" || name === "itemDisc_amount") {
        updatedValue = value.replace(/[^0-9.]/g, '');  // Allow only numbers and dots
      }
    
      setFormData(prevData => {
        const updatedFormData = {
          ...prevData,
          [name]: updatedValue
        };
    
        // If any of the fields that affect total are changed, recalculate the total
        const qty = parseInt(updatedFormData.qty || 1);  // Default qty to 1
        const price = parseFloat(updatedFormData.price || 0);
        const tax = parseFloat(updatedFormData.tax || 0);
        const discPercent = parseFloat(updatedFormData.itemDisc_percent || 0);
        const discAmount = parseFloat(updatedFormData.itemDisc_amount || 0);
    
        // Calculate the Tax Amount and Discount Amount
        const taxAmount = (price * qty * tax) / 100;
        const discountAmount = (price * qty * discPercent) / 100;
    
         // If tax, discount percent, or discount amount is not provided, the total should be the price
    const totalAmount = (tax === 0 && discPercent === 0 && discAmount === 0) 
    ? (price * qty)  // Just use price * quantity
    : (price * qty) + taxAmount - discountAmount - discAmount;
    
        updatedFormData.total = totalAmount.toFixed(2);  // Set total with 2 decimal places
    
        return updatedFormData;
      });
    };
    

const handleAddItem = () => {
      // Retrieve the current total and particulars
      const currentTotal = parseFloat(formData.total || 0); // Default to 0 if no total
      const particulars = formData.particulars;
    
      if (!particulars || currentTotal === 0) {
        alert("Please select particulars and ensure the total is calculated!");
        return;
      }
    
      setItems((prevItems) => [
        ...prevItems,
        {
          serialNo: prevItems.length + 1, // Serial number
          particulars,
          total: currentTotal.toFixed(2),
        },
      ]);
    
      // Update the final amount and reset the form for new entry
      setFormData((prevData) => {
        const updatedFinalAmount = parseFloat(prevData.finalAmount || 0) + currentTotal;
    
        return {
          ...prevData,
          finalAmount: updatedFinalAmount.toFixed(2),
          amount_receivable: updatedFinalAmount.toFixed(2), // Set amount_receivable to finalAmount initially
          amount_received: updatedFinalAmount.toFixed(2), // Set amount_received to finalAmount initially
          particulars: "",
          qty: 1,
          price: "",
          tax: "",
          itemDisc_percent: "",
          itemDisc_amount: "",
          total: "",
        };
      });
};

const handleDelete = (serialNo) => {
      setItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.serialNo !== serialNo);
        
        // Recalculate the total amount after deletion
        const newFinalAmount = updatedItems.reduce((acc, item) => acc + parseFloat(item.total), 0);
    
        setFormData((prevData) => {
          // Calculate the new values for finalAmount, amount_receivable, and amount_received
          const newAmountReceivable = newFinalAmount.toFixed(2);
          const newAmountReceived = newFinalAmount.toFixed(2);
    
          return {
            ...prevData,
            finalAmount: newFinalAmount.toFixed(2),
            amount_receivable: newAmountReceivable,
            amount_received: newAmountReceived,
          };
        });
    
        return updatedItems;
      });
};
    
    

   
const handleAmountChange = (e) => {
      const { name, value } = e.target;

      let updatedValue = value;
      
      // For numeric fields, handle the conversion properly
      if (name === "disc_percent" || name === "disc_amount") {
        updatedValue = value.replace(/[^0-9.]/g, '');  // Allow only numbers and dots
      }
    
      setFormData(prevData => {
        const updatedFormData = {
          ...prevData,
          [name]: updatedValue
        };
    
        const finalAmount = parseFloat(updatedFormData.finalAmount || 0);
        const discPercent = parseFloat(updatedFormData.disc_percent || 0);
        const discAmount = parseFloat(updatedFormData.disc_amount || 0);
    
        // Calculate the  Discount Amount
        const discountAmount = (finalAmount * discPercent) / 100;
    
         // If discount percent or discount amount is not provided, the total should be the price
        const Amount_receivable = ( discPercent === 0 && discAmount === 0) 
        ? finalAmount  
        : finalAmount  - discountAmount - discAmount;
        
    updatedFormData.amount_receivable = Amount_receivable.toFixed(2);  // Set total with 2 decimal places

    // Ensure amount_received is only updated automatically if the user hasn't manually modified it
    if (name !== "amount_received") {
      updatedFormData.amount_received = Amount_receivable.toFixed(2);
    }
    
        return updatedFormData;
      });
    };
 
// const handlebill = async () => {
//     if (parseFloat(formData.amount_received) > parseFloat(formData.total)) {
//         setError('Amount received cannot be greater than the total.');
//         return;
//     }
//     const billingData = {
//         ...formData,
//         items: formData.items
//     };
//     console.log('Op-Billing Data:', billingData); 
//     try {
//       const response = await axios.post(`https://hmis-production.up.railway.app/hmis/add-opbill/${patient._id}`, billingData,{
//         headers: {


const handlebill = async (e) => {
    e.preventDefault(); 

    // Validation
  // if (!formData.provider || !formData.consultant) {
  //   alert('Please fill in all required fields!');
  //   return;
  // }

    // Validation for amount fields
    if (!formData.amount_receivable || !formData.amount_received || !formData.pay_type) {
      alert('Amount receivable, amount received and Payment Type cannot be blank!');
      return;
    }
    // Optional: You can also validate numeric inputs (e.g., non-negative numbers)
    if (isNaN(formData.amount_receivable) || isNaN(formData.amount_received)) {
      alert('Amount receivable and amount received must be valid numbers!');
      return;
    }
    if (Number(formData.amount_received) > Number(formData.amount_receivable)) {
      alert('Amount received cannot exceed the amount receivable!');
      return;
    }

    setLoading(true);

    console.log(formData);
  
    try {
      const response = await axios.post(`https://hmis-production.up.railway.app/hmis/add-opbill/${patient._id}`, formData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      } );
      alert("OP Bill created Successfully!");
      console.log('payment successful:', response.data);
      navigate('/patient/bill_paper', { state: { ...formData, patient } });
    } catch (error) {
      console.error('Check-in error:', error.response ? error.response.data : error.message);
      setError('Error during billing. Please try again.'); 
    }finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add content to the PDF
    doc.setFontSize(18);
    doc.text('OP Bill Receipt', 10, 10);
    doc.setFontSize(12);
    doc.text(`Patient Name: ${patient.name}`, 10, 20);
    doc.text(`Patient ID: ${patient._id}`, 10, 30);
    doc.text(`Consultant: ${formData.consultant}`, 10, 40);
    doc.text(`Provider: ${formData.provider}`, 10, 50);
  
    doc.text('Bill Details:', 10, 70);
    doc.text(`Particulars: ${formData.particulars}`, 10, 80);
    doc.text(`Quantity: ${formData.qty}`, 10, 90);
    doc.text(`Price: ${formData.price}`, 10, 100);
    doc.text(`Tax: ${formData.tax}`, 10, 110);
    doc.text(`Discount: ${formData.itemDisc_amount}`, 10, 120);
    doc.text(`Final Amount: ${formData.finalAmount}`, 10, 130);
  
    doc.text('Payment Details:', 10, 150);
    doc.text(`Amount Receivable: ${formData.amount_receivable}`, 10, 160);
    doc.text(`Amount Received: ${formData.amount_received}`, 10, 170);
    doc.text(`Payment Mode: ${formData.pay_mode}`, 10, 180);
  
    // Save the PDF
    doc.save(`Bill_${patient._id}.pdf`);
  };
  

  return (
    <div className="container">
      <h2 className="title">OP Bill</h2>
      
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

          <div style={{ margin: '10px', width: '30%' }}>
            <p><strong>Gender</strong></p>
            <div className="display-field"> {patient.gender} </div>
          </div>

          <div style={{ margin: '10px', width: '30%' }}>
            <p><strong>Age</strong></p>
            <div className="display-field"> {patient.ageDetails.ageYear} </div>
          </div>
        </div>
      )}




<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ margin: '10px', width: '30%' }}>
        <p><strong>Provider</strong></p>
        <select
            name="provider"
            onChange={handleInputChange}
            value={formData.provider}
            className="select-field"
        >
            <option value="">-------</option>
            <option value="Star Health">Star Health</option>
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
            {/* Options will be dynamically fetched and populated later */}
        </select>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
          <p style={{ textAlign: 'left', fontSize: '18px' }}><strong>Referred By</strong></p>
          <select
            name="referredBy"
            onChange={handleInputChange}
            value={formData.referredBy}
            className="select-field"
          >
            <option value="">Select Referred By</option>
            <option> self</option>
            {/* Options will be dynamically fetched and populated later */}
          </select>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
          <p><strong>Mode/Visit</strong></p>
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
</div>


<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ margin: '10px', width: '30%' }}>
          <p><strong>Particulars</strong></p>
          <select
            name="particulars"
            onChange={handlePriceChange}
            value={formData.particulars}
            className="select-field"
          >
            <option value="">-Select Particulars-</option>
          {/* NCCT Scan Category */}  
          <option disabled style={{ fontWeight: 'bold', textDecoration: 'underline' }}>NCCT Scan</option>    
      <option value="NCCT scan Brain - Rs. 6000">NCCT scan Brain - Rs. 6000</option>
      <option value="NCCT scan Knee Joint - Rs. 2000">NCCT scan Knee Joint - Rs. 2000</option>
          {/* Consultant Category */}
          <option disabled style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Consultant</option>
      <option value="Follow up - Rs. 0">Follow up - Rs. 0</option>
      <option value="Dr A. Sidda Reddy consultation - Rs. 1000">Dr A. Sidda Reddy consultation - Rs. 1000</option>
      <option value="Dr Debadatta Saha consultation - Rs. 800">Dr Debadatta Saha consultation - Rs. 800</option>
          </select>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
        <p><strong>Quantity</strong></p>
          <input type="text" name="qty"
            onChange={handleInputChange}
            value={formData.qty ||1}  />
        </div>  

        <div style={{ margin: '10px', width: '30%' }}>
        <p><strong>Price</strong></p>
          <input type="text" name="price"
            onChange={handlePriceChange}
            value={formData.price} 
            readOnly // Makes the field non-editable 
            />
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
        <p><strong>Tax(%) </strong></p>
          <input type="text" name="tax"
            onChange={handleInputChange}
            value={formData.tax}   />
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
        <p><strong>Disc(%) </strong></p>
          <input type="number"  name="itemDisc_percent"
            onChange={handleInputChange}
            value={formData.itemDisc_percent} />
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
        <p><strong>Discount </strong></p>
          <input type="number" name="itemDisc_amount"
            onChange={handleInputChange}
            value={formData.itemDisc_amount}  />
        </div>

        <div style={{ margin: "10px", width: "30%" }}>
        <p><strong>Total</strong></p>
        <input type="text" name="total" value={formData.total} readOnly />
        </div>

        <button onClick={handleAddItem} >  Add   </button>
</div>

{/* Render the List of Added Items */}
<div style={{ marginTop: "20px" }}>
  <h3>Added Items</h3>
  {items.length > 0 ? (
    <table border="1" style={{ width: "100%", textAlign: "left", marginTop: "10px" }}>
      <thead>
        <tr>
          <th>Serial No</th>
          <th>Particulars</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td>{item.serialNo}</td>
            <td>{item.particulars}</td>
            <td>{item.total}</td>

            <td className="delete-cell">
                  <button
                    onClick={() => handleDelete(item.serialNo)}
                    className="delete-btn"
                  >
                    &#10005;
                  </button>
                </td>


          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No items added yet.</p>
  )}
</div>



  {/* Render Final Amount */}
 <div className="calculated-values-container">
 <div style={{ float: 'right', width: '20%', marginTop: '20px' }}>
 
      <div className="input-group">
        <p><strong>Total(Rs):</strong></p>
          <input type="number" name="finalAmount" value={formData.finalAmount || '0'} readOnly />
      </div>

      <div className="input-group">
        <p><strong>Disc (%):</strong></p>
        <div className="display-field">
        <input type="number"  name="disc_percent"  
       onChange={handleAmountChange}
       value={formData.disc_percent } /></div>
      </div>

      <div className="input-group">
        <p><strong>Discount:</strong></p>
        <div className="display-field">
        <input type="number" name="disc_amount"
       onChange={handleAmountChange}
       value={formData.disc_amount } /></div>
      </div>

    <div className="input-group">
    <p><strong>Amount Receivable:</strong></p>
    <input type="number" name="amount_receivable"
      value={formData.amount_receivable }  readOnly />
    </div>

    <div className="input-group">
  <p><strong>Amount Received:</strong></p>
  <div className="display-field">
  <input type="number" name="amount_received" 
  value={formData.amount_received}
    onChange={handleAmountChange}
      /></div>
  </div>


</div>
</div>

<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ float: 'left', width: '20%', marginTop: '20px' }}>

          <div style={{ margin: '10px', width: '30%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

            <p><strong>Payment Mode</strong></p>
              <label>
                <input
                  type="radio" name="pay_mode" value="single"
                  onChange={handleInputChange}
                  checked={formData.pay_mode === 'single'}
                />  Single  </label>

              <label>
                <input
                  type="radio"  name="pay_mode"  value="multiple"
                  onChange={handleInputChange}
                  checked={formData.pay_mode === 'multiple'}
                />  Multiple  </label>
            </div>
          </div>

          <div style={{ margin: '10px', width: '30%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

          <p style={{ margin: 0 }}><strong>Payment Type</strong></p>
          <select
            name="pay_type"
            onChange={handleInputChange}
            value={formData.pay_type}
            className="select-field"
            style={{ width: '200px' }}
          >
            <option value=""></option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="DD">DD</option>
            <option value="Neft">Neft</option>
          </select>
          </div>
        </div>

        <div style={{ margin: '10px', width: '30%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p style={{ margin: 0 }}><strong>Additional Note:</strong></p>
            <input type="text" name="additional_note"
              onChange={handleInputChange}
              value={formData.additional_note} 
              style={{ width: '200px' }}/>
          </div>    
        </div>
      </div>  
</div>
 
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <button
      onClick={async () => {
        const isSubmitted = await handlebill(); // Submit the bill
        if (isSubmitted) generatePDF();  }}
      className="confirm-receive-btn" >
      Confirm Received & Generate Bill
    </button>
  </div>
 
</div>
 );
};

export default Op_Bill;