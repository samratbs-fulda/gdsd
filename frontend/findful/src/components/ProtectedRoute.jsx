import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredRole }) => {
  // Get JWT from localStorage or cookies
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the token
    const decodedToken = jwtDecode(token);

    // Check for role authorization
    if (decodedToken["role"] !== requiredRole) {
      // Redirect unauthorized users to "403 Forbidden" page
      return <Navigate to="/" replace />;
    }

    // If authorized, render the child components (protected page)
    return children;
  } catch (error) {
    console.error('Invalid token:', error);
    // Redirect to login if token is invalid
    return <Navigate to="/login" replace />;
  }
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, 
    requiredRole: PropTypes.string.isRequired,
}

export default ProtectedRoute;
