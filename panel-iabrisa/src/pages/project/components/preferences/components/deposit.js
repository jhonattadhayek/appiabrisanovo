import React, { useState } from 'react';

import { Box, InputAdornment, TextField } from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiSwitch from 'components/mui/switch';
import { H4, H5 } from 'components/typography';

export default function Deposit({ project }) {
  const [depositActived, setDepositActived] = useState(
    project?.pages.deposit.actived
  );

  return (
    <Box>
      <FlexBox alignItems="center" gap={1}>
        <FlexBox
          justifyContent="center"
          alignItems="center"
          sx={{
            width: 30,
            height: 30,
            background: '#5842bc24',
            color: '#5742b9',
            borderRadius: '4px'
          }}
        >
          <i
            className="fi fi-sr-sack-dollar"
            style={{ fontSize: '14px', marginBottom: -3 }}
          />
        </FlexBox>

        <H4>Página de Depósito</H4>
      </FlexBox>

      <Box mt={3}>
        <Box mb={1}>
          <H5 fontWeight={500}>URL</H5>
        </Box>

        <TextField
          fullWidth
          placeholder="Ex: https://bet.br/deposit"
          disabled={!depositActived}
          id="depositURL"
          defaultValue={project?.pages?.deposit?.url}
          sx={{ '& > .MuiInputBase-root': { height: 45 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ mr: 1 }}>
                <MuiSwitch
                  defaultChecked={depositActived}
                  name="pages.deposit.actived"
                  id="depositActived"
                  onChange={e => setDepositActived(e.target.checked)}
                />
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Box>
  );
}
