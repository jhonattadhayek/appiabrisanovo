import React from 'react';

import { Box, CircularProgress, Container } from '@mui/material';
import useApp from 'hooks/useApp';

export default function LoadingScreen() {
  const { app } = useApp();

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
        <CircularProgress
          aria-label="Loading"
          sx={{ color: app?.theme?.primaryColor || '#fff' }}
        />
      </Box>
    </Container>
  );
}
