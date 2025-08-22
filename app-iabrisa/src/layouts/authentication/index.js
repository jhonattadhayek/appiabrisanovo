import React from 'react';
import { Outlet } from 'react-router';

import { Card, CardContent } from '@mui/material';
import FlexBox from 'components/flexBox';

export default function AuthLayout({ children }) {
  return (
    <FlexBox
      alignItems="center"
      flexDirection="column"
      sx={{ height: '100vh', pt: 10 }}
    >
      <Card
        sx={{
          maxWidth: 350,
          background: 'transparent',
          border: 'none !important'
        }}
      >
        <CardContent>{children || <Outlet />}</CardContent>
      </Card>
    </FlexBox>
  );
}
