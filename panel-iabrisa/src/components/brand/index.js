import React from 'react';

import FlexBox from 'components/flexBox';

import { H3, Span } from '../typography';

export default function Brand() {
  return (
    <FlexBox justifyContent="center" alignItems="center" gap={0.5}>
      <H3
        sx={{
          fontSize: '24px',
          fontWeight: 200,
          letterSpacing: '-1px',
          color: '#000'
        }}
      >
        AI Trader
      </H3>

      <Span
        sx={{
          background: '#5742b9',
          color: '#fff',
          fontWeight: 700,
          borderRadius: '4px',
          padding: '0px 6px'
        }}
      >
        PRO
      </Span>
    </FlexBox>
  );
}
