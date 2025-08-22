import React, { Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppBar, Box, IconButton, styled, Toolbar } from '@mui/material';
import FlexBox from 'components/flexBox';
import { H2, H5 } from 'components/typography';
import useApp from 'hooks/useApp';

const UserIcon = () => (
  <i
    className="fi fi-rr-user"
    style={{
      color: '#fff',
      fontSize: '15px',
      marginBottom: -4
    }}
  />
);

export default function Header({ title }) {
  const { app } = useApp();

  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const showUserIcon =
    app?.pages?.login?.actived && params.get('tab') !== 'minha-conta';

  // ToDO => Trocar esse state pelo valor da API
  const [balance] = useState('R$ 0,00');

  return (
    <Fragment>
      <NavbarRoot position="static">
        <StyledToolBar>
          <FlexBox alignItems="center" gap={1.5}>
            <H2 color="#fff" fontWeight={500}>
              {title}
            </H2>
          </FlexBox>

          <Box flexGrow={1} />

          <FlexBox
            justifyContent="center"
            alignItems="center"
            sx={{
              height: 35,
              px: 1.5,
              mr: 1.2,
              borderRadius: 1,
              cursor: 'pointer',
              backgroundColor: '#191f24',
              '&:hover': {
                backgroundColor: '#191f24'
              }
            }}
          >
            <FlexBox gap={1} alignItems="center">
              <H5 color="#FFF">{balance}</H5>
            </FlexBox>
          </FlexBox>

          {showUserIcon && (
            <Link to={`/${app?.slug}/app?tab=minha-conta`}>
              <IconButton
                sx={{
                  width: 35,
                  height: 35,
                  backgroundColor: '#191f24',
                  '&:hover': {
                    backgroundColor: '#191f24'
                  }
                }}
              >
                <UserIcon />
              </IconButton>
            </Link>
          )}
        </StyledToolBar>
      </NavbarRoot>
    </Fragment>
  );
}

const NavbarRoot = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.appBar + 1,
  padding: 0,
  boxShadow: 'none',
  justifyContent: 'center',
  height: 60,
  backgroundColor: theme.palette.background.default
}));

const StyledToolBar = styled(Toolbar)(() => ({
  paddingLeft: '0px !important',
  paddingRight: '0px !important'
}));
