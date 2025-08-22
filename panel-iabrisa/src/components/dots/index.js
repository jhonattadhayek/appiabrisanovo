import React from 'react';

import { Box, styled } from '@mui/material';

export default function DotsProgress(props) {
  const { fontSize } = props;

  return (
    <Box
      id="dots-loading"
      sx={{ '& > span': { width: fontSize, height: fontSize } }}
    >
      <Dots />
      <Dots />
      <Dots />
    </Box>
  );
}

const Dots = styled('span')(() => ({
  display: ' inline-block',
  borderRadius: '50%',
  margin: 2,
  background: '#232833'
}));
