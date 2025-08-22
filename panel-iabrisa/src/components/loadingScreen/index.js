import React from 'react';

import { Box, CircularProgress, Container } from '@mui/material';

export default function LoadingScreen() {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box textAlign="center">
        <CircularProgress aria-label="Loading" />
      </Box>
    </Container>
  );
}
