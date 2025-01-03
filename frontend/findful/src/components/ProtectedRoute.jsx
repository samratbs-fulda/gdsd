import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, user }) => {
  try {
    if (!user) {
      throw new Error('User is null');
    }

    const role = user["role"];

    // Check for role authorization
    if (role !== requiredRole) {
      // Redirect unauthorized users to "403 Forbidden" page
      return <Navigate to="/" replace />;
    }

    // If authorized, render the child components (protected page)
    return children;
  } catch (error) {
    console.error('Invalid user:', error);
    // Redirect to login if user is invalid
    return <Navigate to="/login" replace />;
  }
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, 
    requiredRole: PropTypes.string.isRequired,
    user: PropTypes.object,
}

export default ProtectedRoute;
