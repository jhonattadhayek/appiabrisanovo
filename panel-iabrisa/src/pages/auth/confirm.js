import React from 'react';
import { Link } from 'react-router-dom';

import { Alert, Box } from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H2, Paragraph } from 'components/typography';

export default function Confirm() {
  return (
    <FlexBox sx={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <Box textAlign="center">
        <i
          className="fi fi-rr-envelope"
          style={{ fontSize: '32px' }}
          aria-label="Ícone de envelope"
        />

        <H2 fontSize="1.6rem" fontWeight={700} component="h1">
          Verifique seu e-mail
        </H2>

        <Paragraph fontSize="16px" fontWeight={400}>
          Enviamos um link de acesso para você.
        </Paragraph>
      </Box>

      <Box>
        <Alert
          icon={
            <i
              className="fi fi-sr-check-circle"
              aria-label="Ícone de sucesso"
            />
          }
          severity="success"
        >
          <Paragraph sx={{ mt: 0.2 }}>
            Certifique-se de verificar seu spam.
          </Paragraph>
        </Alert>
      </Box>

      <Box textAlign="center">
        <Link to="/login">
          <MuiButton
            disableFocusRipple
            sx={{
              padding: 0,
              '&:hover': { backgroundColor: 'transparent' },
              textTransform: 'none'
            }}
            startIcon={
              <i
                className="fi fi-rr-arrow-small-left"
                style={{ marginTop: 3, marginRight: '-2px' }}
                aria-label="Ícone de seta para a esquerda"
              />
            }
          >
            Voltar
          </MuiButton>
        </Link>
      </Box>
    </FlexBox>
  );
}
