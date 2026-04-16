import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import PropertyListings from './pages/PropertyListings';
import VehiclesList from './pages/VehiclesList';
import AllAds from './pages/AllAds';
import UserProfile from './pages/UserProfile';

// New Pages from Stitch Implementation
import PostAd from './pages/PostAd';
import PropertyDetails from './pages/PropertyDetails';
import VehicleDetails from './pages/VehicleDetails';
import Messaging from './pages/Messaging';
import AdminDashboard from './pages/AdminDashboard';
import AdminPortal from './pages/AdminPortal';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = isAuthenticated && localStorage.getItem('role') === 'ADMIN';
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={isAuthenticated ? <Navigate to="/profile?tab=dashboard" replace /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        
        <Route path="/all-ads" element={<AllAds />} />
        <Route path="/property" element={<PropertyListings />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        
        <Route path="/vehicles" element={<VehiclesList />} />
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        
        <Route path="/post-ad" element={isAuthenticated ? <PostAd /> : <Navigate to="/login" />} />
        <Route path="/messaging" element={isAuthenticated ? <Messaging /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to={isAuthenticated ? '/' : '/login'} />} />
        <Route path="/admin-moderation" element={isAdmin ? <AdminPortal /> : <Navigate to={isAuthenticated ? '/' : '/login'} />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
