import React from 'react';

import { Box } from '@mui/material';

import Numbers from './components/numbers';
import UsersChart from './components/usersChart';

export default function Overview({ project }) {
  return (
    <Box>
      <Numbers project={project} />

      <Box mt={3}>
        <UsersChart project={project} />
      </Box>
    </Box>
  );
}
