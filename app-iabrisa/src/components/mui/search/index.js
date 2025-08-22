import React, { useRef } from 'react';

import { IconButton, InputBase, useMediaQuery } from '@mui/material';
import FlexBox from 'components/flexBox';

export default function MuiSearch({ search, clean, width = '22%' }) {
  const inputRef = useRef(null);
  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const handleSearch = () => {
    if (inputRef.current) {
      const value = inputRef.current.value.trim();
      search(value);
    }
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') handleSearch();
  };

  const handleChange = event => {
    if (event.target.value === '') clean();
  };

  return (
    <FlexBox
      alignItems="center"
      sx={{
        width: downMd ? '100%' : width,
        pl: 1.2,
        borderRadius: '4px',
        background: '#fff',
        border: '1px solid #eaecf0',
        height: 34
      }}
    >
      <InputBase
        inputRef={inputRef}
        name="search"
        sx={{ flex: 1 }}
        placeholder="Buscar..."
        onChange={handleChange}
        onKeyDown={handleKeyPress}
      />

      <IconButton
        disableRipple
        disableFocusRipple
        onClick={handleSearch}
        aria-label="Procurar"
      >
        <i
          className="fi fi-rr-search"
          style={{ fontSize: '16px', marginTop: 3 }}
        />
      </IconButton>
    </FlexBox>
  );
}
