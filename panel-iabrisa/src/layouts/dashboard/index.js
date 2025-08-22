import React, { useEffect, Fragment, useState } from 'react';
import { Outlet } from 'react-router';

import { Box, Container, styled } from '@mui/material';
import PropTypes from 'prop-types';

import Header from './components/header';
import Sidebar from './components/sidebar';

export default function DashboardLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <Fragment>
      <Header handleOpenSidebar={handleOpenSidebar} />
      {showSidebar && <Sidebar onClose={handleOpenSidebar} />}

      <Wrapper>
        <Container maxWidth="md">{children || <Outlet />}</Container>
      </Wrapper>
    </Fragment>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.any
};

const Wrapper = styled(Box)({
  marginTop: 100,
  transition: 'all 0.3s',
  height: '100vh'
});
