// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import Headerbar from './Headerbar';
import { Outlet } from 'react-router-dom'; // use the Outlet component from react-router-dom to allow nested routes to render inside Layout

const Layout = () => {
  return (
    <div>
      <Headerbar /> {/* Include the Headerbar at the top */}
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          <Outlet /> {/* Renders the nested route components here */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
