import React from 'react';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import MuiButton from 'components/mui/button';

export default function BackTo({ path = '/', label = 'Voltar para o início' }) {
  return (
    <Box width="fit-content">
      <Link to={path}>
        <MuiButton
          startIcon={
            <i
              aria-label="Voltar"
              className="fi fi-rr-arrow-small-left"
              style={{ fontSize: '16px', marginBottom: -2 }}
            />
          }
          fullWidth
          disableFocusRipple
          disableRipple
          size="small"
          sx={{
            p: 0,
            color: '#5742b9',
            justifyContent: 'left',
            background: 'transparent',
            '&:hover': {
              background: 'transparent'
            }
          }}
        >
          {label}
        </MuiButton>
      </Link>
    </Box>
  );
}
