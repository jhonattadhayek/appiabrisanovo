import React, { Fragment } from 'react';
import { Navigate } from 'react-router-dom';

import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';
import PropTypes from 'prop-types';

export default function GuestGuard({ children }) {
  const { app } = useApp();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={`/${app?.slug}/app?tab=inicio`} />;
  }

  return <Fragment>{children}</Fragment>;
}

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired
};
