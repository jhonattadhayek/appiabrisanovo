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
          <H1 color="text.default" fontSize="135px">
            404
          </H1>
          <Paragraph color="text.disabled" fontSize="18px" sx={{ mt: -3 }}>
            Página não encontrada.
          </Paragraph>
        </CardContent>
      </Card>
    </FlexBox>
  );
}
