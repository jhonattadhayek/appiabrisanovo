import React from 'react';

import { alpha, Box, Chip, styled } from '@mui/material';
import FlexBox from 'components/flexBox';
import { Span, Tiny } from 'components/typography';
import useApp from 'hooks/useApp';
import { namesGenerator, valueGenerator } from 'utils/generator';

export default function SocialProof() {
  const { app } = useApp();

  return (
    <Box
      mb={2}
      sx={{
        width: '100%',
        overflow: 'hidden',
        pt: '0.3rem',
        pb: '0.3rem'
      }}
    >
      <Box id="scroll-left">
        <FlexBox>
          {namesGenerator(100).map((name, index) => {
            return (
              <CustomChip
                key={index}
                size="small"
                sx={{
                  boxShadow: `0 0 3px ${alpha(app?.theme?.primaryColor, 0.5)}`
                }}
                label={
                  <Box sx={{ width: 'max-content' }}>
                    <Tiny>
                      <b>{name} </b>
                      Lucrou{' '}
                      <Span color={app?.theme?.primaryColor} fontWeight={600}>
                        {valueGenerator(
                          9,
                          235,
                          app?.resources?.socialProof.currency || 'BRL'
                        )}
                      </Span>
                    </Tiny>
                  </Box>
                }
                variant="outlined"
              />
            );
          })}
        </FlexBox>
      </Box>
    </Box>
  );
}

const CustomChip = styled(Chip)(() => ({
  marginRight: 8,
  padding: '0.4rem 0.2rem',
  borderRadius: 4,
  backgroundColor: '#191f24',
  border: 'none'
}));
