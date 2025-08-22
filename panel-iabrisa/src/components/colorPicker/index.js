import React, { useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';

import styled from '@emotion/styled';
import { Box, InputAdornment, TextField } from '@mui/material';

export default function ColorPicker({ defaultColor, setColor }) {
  const colorPickerRef = useRef(null);

  const [showPicker, setShowPicker] = useState(false);
  const [color, selectColor] = useState(defaultColor);

  useEffect(() => {
    setColor(color);
  }, [color]);

  return (
    <TextField
      name="color"
      sx={{ '& > .MuiInputBase-root': { height: 45 } }}
      value={color}
      disabled={true}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box>
              <SelectColor
                ref={colorPickerRef}
                sx={{ background: color }}
                onClick={() => setShowPicker(true)}
              />

              {showPicker && (
                <Box
                  sx={{
                    position: 'absolute',
                    zIndex: 2,
                    top:
                      colorPickerRef.current.offsetTop +
                      10 +
                      colorPickerRef.current.clientHeight +
                      'px',
                    left: colorPickerRef.current.offsetLeft + 'px'
                  }}
                >
                  <Box
                    sx={{
                      position: 'fixed',
                      top: '0px',
                      right: '0px',
                      bottom: '0px',
                      left: '0px'
                    }}
                    onClick={() => setShowPicker(undefined)}
                  />

                  <ChromePicker
                    disableAlpha
                    color={color}
                    onChange={color => {
                      selectColor(color.hex);
                    }}
                  />
                </Box>
              )}
            </Box>
          </InputAdornment>
        )
      }}
    />
  );
}

const SelectColor = styled(Box)(() => ({
  width: 25,
  height: 25,
  cursor: 'pointer',
  marginLeft: -4
}));
