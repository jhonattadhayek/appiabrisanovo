import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import { Span } from 'components/typography';
import { PAGES_NAVBAR } from 'constants/pages';
import useApp from 'hooks/useApp';

export default function Navbar() {
  const { app } = useApp();
  const ref = useRef(null);

  const { search } = useLocation();
  const navigate = useNavigate();

  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    const getQueryValue = key => {
      const params = new URLSearchParams(search);
      return params.get(key) || '';
    };

    setActivePath(getQueryValue('tab'));
  }, [search]);

  const handleNavigate = page => {
    if (activePath !== page.path) {
      setActivePath(page.path);
      navigate(`/${app?.slug}/app?tab=${page.path}`);
    }
  };

  const getIconStyle = () => ({
    color: undefined,
    fontSize: '18px',
    marginBottom: 2,
    marginTop: 14
  });

  const getTextColor = page =>
    activePath === page.path ? app?.theme?.primaryColor : '#6a6d74';

  const filteredPages = PAGES_NAVBAR.filter(page => {
    if (page.path === 'premium' && !app?.pages?.premium?.actived) {
      return false;
    }

    return true;
  });

  return (
    <Box ref={ref}>
      {filteredPages.length && (
        <Paper
          elevation={3}
          sx={{
            background: 'transparent',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100
          }}
        >
          <BottomNavigation
            showLabels
            sx={{
              borderTop: '1px solid #252c33',
              borderTopLeftRadius: '36px',
              borderTopRightRadius: '36px',
              paddingBottom: '10px',
              height: 70
            }}
          >
            {filteredPages.map((page, index) => {
              return (
                <BottomNavigationAction
                  key={index}
                  disableRipple
                  disableTouchRipple
                  label={<Span fontWeight={600}>{page.title}</Span>}
                  onClick={() => handleNavigate(page)}
                  icon={<i className={page.icon} style={getIconStyle()} />}
                  sx={{ color: getTextColor(page) }}
                />
              );
            })}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
