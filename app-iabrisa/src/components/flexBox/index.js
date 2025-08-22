import React from 'react';

import { Box } from '@mui/material';
import PropTypes from 'prop-types';

export default function FlexBox({ children, ...rest }) {
  return (
    <Box display="flex" {...rest}>
      {children}
    </Box>
  );
}

FlexBox.propTypes = {
  children: PropTypes.any.isRequired
};
