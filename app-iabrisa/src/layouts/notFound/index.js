import React from 'react';

import { Card, CardContent } from '@mui/material';
import FlexBox from 'components/flexBox';
import { H1, Paragraph } from 'components/typography';

export default function NotFoundLayout() {
  return (
    <FlexBox
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      textAlign="center"
      sx={{ height: '100vh' }}
    >
      <Card
        sx={{
          maxWidth: 350,
          background: 'transparent',
          border: 'none !important',
          boxShadow: 'none'
        }}
      >
        <CardContent>
          <H1 color="#d2d1d1" fontSize="135px">
            404
          </H1>
          <Paragraph color="#d2d1d1" fontSize="18px" sx={{ mt: -3 }}>
            Aplicativo não encontrado.
          </Paragraph>
        </CardContent>
      </Card>
    </FlexBox>
  );
}
