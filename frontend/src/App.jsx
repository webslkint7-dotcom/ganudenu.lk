import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

import PropertyListings from './pages/PropertyListings';
import VehiclesList from './pages/VehiclesList';


function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vehicles" element={<VehiclesList />} />
      <Route path="/property" element={<PropertyListings />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
