import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  alpha,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import FlexBox from 'components/flexBox';
import Header from 'components/header';
import MuiButton from 'components/mui/button';
import PremiumCard from 'components/premiumCard';
import { H5, Paragraph, Small } from 'components/typography';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';

export default function Premium() {
  const { app } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const list = app?.games.filter(
      game => game.premium !== false && game.actived === true
    );
    setGames(list || []);
  }, [app]);

  const handleOpen = gameId => {
    if (user?.signature === 'paid') {
      return navigate(`/${app?.slug}/app?tab=sinais&id=${gameId}`);
    }

    return toast.error('Atualize sua assinatura para continuar');
  };

  return (
    <Fragment>
      <Header title="Premium" />

      <Box mt={2}>
        <PremiumCard />

        <Box mt={3}>
          {games.length === 0 && (
            <Card>
              <CardContent>
                <FlexBox justifyContent="center" textAlign="center">
                  <Paragraph color="text.disabled">
                    Oops! Nenhum sinal encontrado.
                  </Paragraph>
                </FlexBox>
              </CardContent>
            </Card>
          )}

          {games.map((game, index) => {
            return (
              <Box key={index} mb={3}>
                <Card
                  onClick={() => handleOpen(game.id)}
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
                        onClick={() => handleOpen(game.name)}
                        disabled={user?.signature === 'free'}
                        variant="contained"
                        fullWidth
                        sx={{
                          height: 40,
                          color: app?.theme?.primaryColor,
                          background: alpha(app?.theme?.primaryColor, 0.1),
                          '&:hover': {
                            background: alpha(app?.theme?.primaryColor, 0.1),
                            color: app?.theme?.primaryColor
                          }
                        }}
                      >
                        {user?.signature === 'free' ? 'Bloqueado' : 'Entrar'}
                      </MuiButton>
                    </FlexBox>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Fragment>
  );
}
