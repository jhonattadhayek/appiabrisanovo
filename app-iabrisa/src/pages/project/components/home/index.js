import React, { useEffect, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  alpha,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid
} from '@mui/material';
import FlexBox from 'components/flexBox';
import Header from 'components/header';
import MuiButton from 'components/mui/button';
import { H5, Small } from 'components/typography';
import useApp from 'hooks/useApp';

import Banners from './components/banners';
import OnlineUsers from './components/onlineUsers';
import SocialProof from './components/socialProof';

export default function Home() {
  const { app } = useApp();

  const [games, setGames] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const list = app?.games.filter(
      game => game.premium === false && game.actived === true
    );

    setGames(list || []);
  }, [app]);

  const handleOpen = gameId => {
    return `/${app?.slug}/app?tab=sinais&id=${gameId}`;
  };

  return (
    <Fragment>
      <Header title={app?.pages?.home?.showName ? app?.name : 'Início'} />

      {app?.resources?.socialProof?.actived && (
        <Box>
          <SocialProof />
        </Box>
      )}

      {app?.resources?.onlineUsers?.actived && (
        <Box>
          <OnlineUsers />
        </Box>
      )}

      <Box mt={3}>
        <Banners />
      </Box>

      <Box mt={5}>
        <Grid container spacing={3}>
          {games.map(game => (
            <Grid key={game.name} item xs={12}>
              <Link to={handleOpen(game.id)}>
                <Card
                  sx={{
                    borderRadius: '20px',
                    cursor: 'pointer',
                    background: ' #191f24',
                    border: '1px solid #21282d !important'
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '14% !important'
                        }}
                        src={game.image}
                      />
                    }
                    title={<H5 fontSize="18px">{game.name}</H5>}
                    subheader={
                      <FlexBox gap={0.4} alignItems="center">
                        <i
                          className="fi fi-br-bullseye-arrow"
                          style={{
                            fontSize: '12px',
                            marginBottom: -6,
                            color:
                              game.assertiveness < 89 && game.assertiveness > 65
                                ? '#eba92b'
                                : game.assertiveness < 65
                                ? '#eb2b2b'
                                : '#08bc15'
                          }}
                        />

                        <Small
                          fontSize="14px"
                          sx={{
                            ml: 0.5,
                            fontWeight: 500,
                            color:
                              game.assertiveness < 89 && game.assertiveness > 65
                                ? '#eba92b'
                                : game.assertiveness < 65
                                ? '#eb2b2b'
                                : '#08bc15'
                          }}
                        >
                          {game.assertiveness}%
                        </Small>
                      </FlexBox>
                    }
                  />

                  <CardContent>
                    <FlexBox
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: -1 }}
                    >
                      <MuiButton
                        onClick={() => handleOpen(game.id)}
                        variant="contained"
                        fullWidth
                        sx={{
                          height: 40,
                          color: app?.theme?.primaryColor,
                          background: alpha(app?.theme?.primaryColor, 0.3),
                          '&:hover': {
                            background: alpha(app?.theme?.primaryColor, 0.3),
                            color: app?.theme?.primaryColor
                          }
                        }}
                      >
                        Entrar
                      </MuiButton>
                    </FlexBox>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fragment>
  );
}
