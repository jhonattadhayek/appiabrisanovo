import React, { useEffect, useState } from 'react';

import { Box, Divider, Drawer, styled } from '@mui/material';
import Brand from 'components/brand';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { MENU_PROJECT } from 'constants/menuProject';
import ScrollBar from 'simplebar-react';

export default function Sidebar({ onClose }) {
  const [actived, setActived] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');

    setActived(tab || null);
  }, []);

  const handleClickMenu = value => {
    const menu = document.getElementById(value);

    if (menu) {
      menu.click();
      onClose();
    }
  };

  return (
    <Box>
      <DrawerRoot variant="permanent" open={true}>
        <ScrollBar style={{ maxHeight: '100%' }}>
          <FlexBox justifyContent="left" sx={{ p: 1.5 }}>
            <Brand />
          </FlexBox>
          <Divider sx={{ mt: 0.4, mb: 3 }} />

          <Box>
            {MENU_PROJECT.map((menu, index) => (
              <MuiButton
                key={index}
                startIcon={menu.icon}
                onClick={() => handleClickMenu(menu.value)}
                fullWidth
                size="small"
                sx={{
                  pl: 2.3,
                  borderRadius: '0px !important',
                  background:
                    menu.value === actived ? '#5842bc0d' : 'transparent',
                  color: menu.value === actived ? '#5742b9' : '#354052',
                  justifyContent: 'left',
                  height: 40,
                  mb: 0.5
                }}
              >
                {menu.label}
              </MuiButton>
            ))}
          </Box>
        </ScrollBar>
      </DrawerRoot>

      {open && <CloseDownMenu onClick={onClose} />}
    </Box>
  );
}

const CloseDownMenu = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  zIndex: theme.zIndex.drawer - 1
}));

const DrawerRoot = styled(Drawer)(({ theme, width }) => ({
  width: 260,
  flexShrink: 0,
  zIndex: theme.zIndex.drawer + 6,
  [`& .MuiDrawer-paper`]: {
    overflow: 'hidden',
    width: 260
  }
}));
