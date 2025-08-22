import React, { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import FlexBox from 'components/flexBox';

export default function SignalBar(props) {
  const { value } = props;

  const [color, setColor] = useState('');
  const [bars, setBars] = useState(5);

  useEffect(() => {
    const init = () => {
      const barsQty = Math.ceil(value / 20);
      setBars(barsQty);

      if (barsQty > 3) {
        setColor('success.main');
      } else if (barsQty > 1) {
        setColor('warning.light');
      } else {
        setColor('error.main');
      }
    };

    init();
  }, []);

  return (
    <FlexBox alignItems="baseline" justifyContent="center" gap={0.1}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map(i => (
        <Box
          key={i}
          width={6}
          height={5 + 3 * i}
          sx={{
            backgroundColor: theme =>
              i <= bars ? color : theme.palette.background.paper,
            backgroundClip: 'padding-box',
            borderRadius: 0.5,
            border: theme => `1px solid ${theme.palette.background.default}`
          }}
        />
      ))}
    </FlexBox>
  );
}
