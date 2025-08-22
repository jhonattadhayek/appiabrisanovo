import React, { useState } from 'react';

import { Box, Card, CardContent, CardHeader } from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H5, Paragraph } from 'components/typography';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';

export default function PremiumCard() {
  const { app } = useApp();
  const { user } = useAuth();

  const [page] = useState(app?.pages?.premium || {});

  const validateShow = () => page.actived && page.URL && page.cta && page.title;

  return (
    <Box>
      {validateShow() && (
        <Card
          sx={{
            background: user?.signature === 'free' ? '#191f24' : '#ffaa00'
          }}
        >
          <CardHeader
            title={
              <FlexBox alignItems="center" gap={1}>
                <i
                  className={
                    user?.signature === 'free'
                      ? 'fi fi-br-crown'
                      : 'fi fi-sr-crown'
                  }
                  style={{ fontSize: '18px', marginBottom: -4 }}
                />
                <H5 fontSize="18px">
                  {user?.signature === 'free'
                    ? page.title
                    : 'Modo Premium ATIVO 🎉'}
                </H5>
              </FlexBox>
            }
          />
          {user?.signature === 'free' && (
            <CardContent sx={{ mt: -3.5 }}>
              <Paragraph
                color="text.disabled"
                dangerouslySetInnerHTML={{ __html: page.description }}
              />

              <MuiButton
                fullWidth
                href={page.URL}
                target="_blank"
                variant="contained"
                id="pulse"
                sx={{
                  mt: 2,
                  background: app?.theme?.primaryColor,
                  '&:hover': {
                    background: app?.theme?.primaryColor
                  }
                }}
              >
                {page.cta}
              </MuiButton>
            </CardContent>
          )}
        </Card>
      )}
    </Box>
  );
}
