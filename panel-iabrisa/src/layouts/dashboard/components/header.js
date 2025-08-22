import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  useMediaQuery
} from '@mui/material';
import Brand from 'components/brand';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import useAuth from 'hooks/useAuth';

export default function Header({ handleOpenSidebar }) {
  const { logout } = useAuth();

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  return (
    <Fragment>
      <AppBar position="fixed" sx={styles.appBar}>
        <Container maxWidth="md">
          <Toolbar sx={styles.toolbar}>
            {downMd && (
              <IconButton sx={{ mr: 0.4 }} onClick={handleOpenSidebar}>
                <i
                  className="fi fi-br-menu-burger"
                  style={{ fontSize: '16px', color: '#000', marginBottom: -3 }}
                />
              </IconButton>
            )}

            <Link to="/dashboard">
              <FlexBox alignItems="center" gap={0.5}>
                <Brand width="22px" />
              </FlexBox>
            </Link>

            <Box flexGrow={1} />

            <MuiButton
              size="small"
              variant="contained"
              onClick={logout}
              sx={{
                height: 38,
                color: '#474747',
                background: '#f4f4f4',
                '&:hover': {
                  background: '#f4f4f4'
                }
              }}
              startIcon={
                <i
                  className="fi fi-rr-sign-out-alt"
                  style={{ fontSize: '14px', marginBottom: -3 }}
                />
              }
            >
              Sair
            </MuiButton>
          </Toolbar>
        </Container>
      </AppBar>
    </Fragment>
  );
}

const styles = {
  appBar: {
    height: 64,
    borderColor: 'none',
    justifyContent: 'center',
    boxShadow: 'none',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eaecf0',
    zIndex: 11
  },
  toolbar: {
    '@media (min-width: 0px)': {
      minHeight: 'auto',
      pl: 0,
      pr: 0
    }
  }
};
