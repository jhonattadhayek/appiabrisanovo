import React, { Fragment, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';
import AuthLayout from 'layouts/authentication';
import Login from 'pages/login';
import PropTypes from 'prop-types';

export default function AuthGuard({ children }) {
  const { app } = useApp();
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated && pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
  }, [isAuthenticated, pathname, requestedLocation]);

  if (app?.pages?.login?.actived && !isAuthenticated) {
    return (
      <AuthLayout>
        <Login />
      </AuthLayout>
    );
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <Fragment>{children}</Fragment>;
}

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired
};
