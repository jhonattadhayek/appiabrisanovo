import React, { useState, useEffect, Fragment } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Collapse,
  Grid,
  IconButton,
  useMediaQuery
} from '@mui/material';
import MuiButton from 'components/mui/button';
import { Span } from 'components/typography';
import { MENU_PROJECT } from 'constants/menuProject';
import useAuth from 'hooks/useAuth';

import Overview from './components/overview';
import Preferences from './components/preferences';
import Settings from './components/settings';
import Signals from './components/signals';
import Users from './components/users';

export default function Project() {
  const { user } = useAuth();

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [selected, setSelected] = useState(null);
  const [project, setProject] = useState(user?.project || {});
  const [openAlert, setOpenAlert] = useState(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (project) {
      if (project.status !== 'actived') {
        setOpenAlert({
          title: 'Projeto desativado!',
          description: 'Para reativação, entre em contato com o suporte.'
        });
      }
    }
  }, [project]);

  useEffect(() => {
    const tabMapping = [
      'overview',
      'settings',
      'preferences',
      'signals',
      'users',
      'triggers'
    ];

    const tabKey = tabMapping.find(tab =>
      window.location.search.includes(`tab=${tab}`)
    );

    setSelected(tabKey || 'overview');
  }, [window.location.pathname]);

  const handleTab = value => {
    setSelected(value);

    const newUrl = `${window.location.pathname}?tab=${value}`;
    window.history.pushState(null, '', newUrl);
  };

  const content = {
    overview: <Overview project={project} />,
    settings: <Settings project={project} setProject={setProject} />,
    preferences: <Preferences project={project} setProject={setProject} />,
    signals: <Signals project={project} setProject={setProject} />,
    users: <Users project={project} setProject={setProject} />
  };

  return (
    <Box pb={12}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} sx={{ display: downMd ? 'none' : 'initial' }}>
          <Box position="fixed" maxWidth="218px">
            <Box>
              {MENU_PROJECT.map((menu, index) => (
                <MuiButton
                  key={index}
                  id={menu.value}
                  startIcon={menu.icon}
                  onClick={() => handleTab(menu.value)}
                  fullWidth
                  size="small"
                  sx={{
                    background:
                      menu.value === selected ? '#5842bc0d' : 'transparent',
                    color: menu.value === selected ? '#5742b9' : '#354052',
                    justifyContent: 'left',
                    height: 38,
                    mb: 0.5
                  }}
                >
                  {menu.label}
                </MuiButton>
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Collapse in={openAlert !== undefined}>
            <Alert
              sx={{ mb: 4 }}
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setOpenAlert(undefined)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {openAlert?.title && (
                <Span fontWeight={600}>{openAlert?.title}</Span>
              )}{' '}
              {openAlert?.description && openAlert?.description}
            </Alert>
          </Collapse>

          {content[selected] || <Fragment />}
        </Grid>
      </Grid>
    </Box>
  );
}
