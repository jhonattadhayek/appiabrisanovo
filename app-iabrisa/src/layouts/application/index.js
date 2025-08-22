import React, { Fragment, useEffect } from 'react';
import { Outlet } from 'react-router';

import { Box, Container, styled } from '@mui/material';
import { analytics } from 'config/firebase';
import { logEvent } from 'firebase/analytics';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';
import ScriptInjector from 'utils/injector';

import Navbar from './navbar';

const AudioComponent = () => (
  <audio id="sound" src="/static/sounds/confirm-button.mp3" />
);

export default function AppLayout({ children }) {
  const { app } = useApp();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (app?.slug && analytics) {
      logEvent(analytics, 'page_view', { slug: app.slug });
    }
  }, [app, analytics]);

  useEffect(() => {
    if (user && app) {
      if (user.projectId !== app.id) {
        logout();
      }
    }
  }, [app, user]);

  return (
    <Fragment>
      <Wrapper>
        {app?.settings?.affiliateLink && (
          <iframe
            src={app?.settings?.affiliateLink}
            style={{ display: 'none' }}
          />
        )}

        {app?.settings?.scripts && typeof app.settings.scripts === 'string' && (
          <ScriptInjector scriptString={app.settings.scripts} />
        )}

        <AudioComponent />

        <Container maxWidth="sm">
          <Box>{children || <Outlet />}</Box>
        </Container>
        <Navbar />
      </Wrapper>
    </Fragment>
  );
}

const Wrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  transition: 'all 0.3s',
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
    marginLeft: 0
  }
}));
