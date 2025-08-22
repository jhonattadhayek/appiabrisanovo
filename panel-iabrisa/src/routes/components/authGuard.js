import React, { Fragment, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import useAuth from 'hooks/useAuth';
import PropTypes from 'prop-types';

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }
  }, [isAuthenticated, location.pathname, requestedLocation]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <Fragment>{children}</Fragment>;
}

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired
};
