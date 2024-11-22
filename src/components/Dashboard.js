// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles

import neuro1 from '../assets/neuro1.png'; 
import neuro2 from '../assets/neuro2.png';
import neuro3 from '../assets/neuro3.png';

const Dashboard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const timings = [3000, 3000, 3000]; // Timing for each slide in milliseconds
    const interval = setInterval(() => {
      setSelectedIndex(prevIndex => (prevIndex + 1) % 3);
    }, timings[selectedIndex]);

    return () => clearInterval(interval);
  }, [selectedIndex]);

  const handleChange = index => {
    setSelectedIndex(index);
  };

  const headerStyle = {
    fontFamily: 'Garamond, Serif', 
    color: '#5722ff',
    fontSize: '2rem',
    textAlign: 'center',
    margin: '20px 0'
  };

  return (
    <div>
      <h1 style={headerStyle}>Welcome to the Institute Of Neuro Sciences</h1>
      
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        selectedItem={selectedIndex}
        onChange={handleChange}
      >
        <div>
          <img src={neuro1} alt="Slide 1" style={{ width: '90%', height: 'auto' }} />
        </div>
        <div>
          <img src={neuro2} alt="Slide 2" style={{ width: '90%', height: 'auto' }} />
        </div>
        <div>
          <img src={neuro3} alt="Slide 3" style={{ width: '70%', height: 'auto' }} />
        </div>
      </Carousel>

      {/* Add more dashboard content here */}
    </div>
  );
};

export default Dashboard;
