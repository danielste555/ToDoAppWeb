import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { JwtService } from '../services/jwt.service';

/**
 * ProtectedRoute: wrapper to protect routes requiring authentication.
 * If token is missing or expired, redirect to /login.
 * Else, render nested routes (Outlet).
 */
const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token || JwtService.isTokenExpired(token)) {
    // Clean up expired token
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
