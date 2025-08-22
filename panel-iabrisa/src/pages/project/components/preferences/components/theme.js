import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  Box,
  Collapse,
  InputAdornment,
  TextField,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiSwitch from 'components/mui/switch';
import { H4, Small } from 'components/typography';
import { COLOR_ITEMS } from 'constants/colors';

export default function Theme({ project }) {
  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [colorItem, setColorItem] = useState(project.theme.type);
  const [openColors, setOpenColors] = useState(project.theme.edited || false);

  const { register, watch, setValue, trigger } = useFormContext();

  const primaryColor = watch('theme.primaryColor');
  const secondaryColor = watch('theme.secondaryColor');

  const handleOpenColors = useCallback(() => {
    if (!openColors) {
      setColorItem(null);
      setOpenColors(true);
      setValue('theme.edited', true);
    } else {
      setOpenColors(false);
      setColorItem(COLOR_ITEMS[0].value);

      setValue('theme.edited', false);
      setValue('theme.primaryColor', COLOR_ITEMS[0].primaryColor);
      setValue('theme.secondaryColor', COLOR_ITEMS[0].secondaryColor);

      trigger('theme.primaryColor');
      trigger('theme.secondaryColor');
    }
  }, [openColors, setValue, trigger]);

  const handleChangeColorItem = useCallback(
    value => {
      const item = COLOR_ITEMS.find(item => item.value === value);

      if (item) {
        setOpenColors(false);
        setColorItem(value);

        setValue('theme.edited', false);
        setValue('theme.type', item.value);
        setValue('theme.primaryColor', item.primaryColor);
        setValue('theme.secondaryColor', item.secondaryColor);
      }
    },
    [setValue]
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
            className="fi fi-sr-palette"
            style={{ fontSize: '14px', marginBottom: -3 }}
          />
        </FlexBox>

        <H4>Cores</H4>
      </FlexBox>

      <Box mt={3}>
        <FlexBox gap={2} flexWrap="wrap">
          {COLOR_ITEMS.map(el => (
            <FlexBox
              key={el.value}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              onClick={() => handleChangeColorItem(el.value)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                p: 1,
                border: theme =>
                  el.value === colorItem
                    ? '1px solid #5742b9'
                    : `1px solid ${theme.palette.divider}`,
                width: downMd ? 90 : 108,
                textAlign: 'center',
                transition: 'all 0.1s',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              <Box width="100%" sx={{ borderRadius: 1 }}>
                <Box
                  height={28}
                  width="100%"
                  sx={{
                    backgroundColor: el.secondaryColor,
                    borderRadius: '8px 8px 0 0'
                  }}
                />
                <Box
                  height={28}
                  width="100%"
                  sx={{
                    backgroundColor: el.primaryColor,
                    borderRadius: '0 0 8px 8px'
                  }}
                />
              </Box>

              <Box mt={0.5}>
                <Small>{el.label}</Small>
              </Box>
            </FlexBox>
          ))}
        </FlexBox>
      </Box>

      <Box mt={3}>
        <FlexBox
          gap={1}
          alignItems="center"
          onClick={handleOpenColors}
          sx={{ cursor: 'pointer' }}
        >
          <MuiSwitch checked={openColors} onChange={handleOpenColors} />
          <H4>Personalizar cores</H4>
        </FlexBox>

        <Collapse in={openColors}>
          <FlexBox alignItems="center" mt={2} gap={1}>
            <TextField
              placeholder="Cor primária"
              fullWidth={downMd}
              {...register('theme.primaryColor')}
              sx={{ '& > .MuiInputBase-root': { maxWidth: 140, height: 45 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      mr={1}
                      width={25}
                      height={25}
                      sx={{
                        backgroundColor: primaryColor,
                        borderRadius: 1
                      }}
                    />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              placeholder="Cor primária"
              fullWidth={downMd}
              {...register('theme.secondaryColor')}
              sx={{ '& > .MuiInputBase-root': { maxWidth: 140, height: 45 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      mr={1}
                      width={25}
                      height={25}
                      sx={{
                        backgroundColor: secondaryColor,
                        border: theme => `1px solid ${theme.palette.divider}`,
                        borderRadius: 1
                      }}
                    />
                  </InputAdornment>
                )
              }}
            />
          </FlexBox>
        </Collapse>
      </Box>
    </Box>
  );
}
