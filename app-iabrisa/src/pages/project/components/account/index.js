import React, { Fragment } from 'react';

import { Box, Grid, TextField } from '@mui/material';
import Header from 'components/header';
import MuiButton from 'components/mui/button';
import { Paragraph, Small, Span } from 'components/typography';
import useAuth from 'hooks/useAuth';

export default function Account() {
  const { user, logout } = useAuth();

  return (
    <Fragment>
      <Header title="Minha conta" />

      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box mb={0.5}>
              <Small fontWeight={500} color="text.disabled">
                E-mail
              </Small>
            </Box>

            <TextField
              fullWidth
              disabled
              value={user?.email}
              sx={{
                '& > .MuiInputBase-root': {
                  background: '#15191e'
                }
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Box mb={0.5}>
              <Small fontWeight={500} color="text.disabled">
                Membro desde:
              </Small>
            </Box>

            <TextField
              fullWidth
              disabled
              value={new Date(user?.createdAt).toLocaleDateString()}
              sx={{
                '& > .MuiInputBase-root': {
                  background: '#15191e'
                }
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Box mb={0.5}>
              <Small fontWeight={500} color="text.disabled">
                Plano
              </Small>
            </Box>

            <TextField
              fullWidth
              disabled
              value={user?.signature === 'free' ? 'Básico' : 'Premium'}
              sx={{
                '& > .MuiInputBase-root': {
                  background: '#15191e'
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Paragraph>
              <Span fontWeight={700}>ID: </Span>{' '}
              {'...' + user?.stakbroker?.userId.slice(-5)}
            </Paragraph>
          </Grid>
        </Grid>

        <Box mt={5}>
          <MuiButton
            disableRipple
            disableFocusRipple
            onClick={logout}
            startIcon={
              <i
                className="fi fi-rr-exit"
                style={{ fontSize: '14px', marginBottom: -2 }}
              />
            }
            sx={{
              '&:hover': { background: 'transparent' },
              color: '#f67373',
              p: 0
            }}
          >
            Sair do App
          </MuiButton>
        </Box>
      </Box>
    </Fragment>
  );
}
