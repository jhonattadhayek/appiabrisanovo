import React, { Fragment } from 'react';
import { Navigate } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import PropTypes from 'prop-types';

export default function GuestGuard({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Fragment>{children}</Fragment>;
}

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired
};
