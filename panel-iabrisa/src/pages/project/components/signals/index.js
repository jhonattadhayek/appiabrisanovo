import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Skeleton
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiSearch from 'components/mui/search';
import { H5, Paragraph, Tiny } from 'components/typography';
import { PATTERNS } from 'constants/coins';
import { formatSeconds } from 'utils/formatter';

import GameDialog from './components/gameDialog';
import NewGameDialog from './components/newDialog';

export default function Signals({ project, setProject }) {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(undefined);
  const [games, setGames] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searched, setSearched] = useState(false);
  const [newGame, setNewGame] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'scroll';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getGames = async () => {
      try {
        const games = Object.entries(project.games).map(([key, value]) => ({
          id: key,
          ...value
        }));

        setGames(games);
      } catch (error) {
        console.error(error.message || error);
      } finally {
        setLoading(false);
      }
    };

    getGames();
  }, [project]);

  const search = query => {
    const searchWords = query.toLowerCase().split(' ');

    const result = games.filter(item => {
      const name = item.name.toLowerCase();
      return searchWords.every(word => name.includes(word));
    });

    if (result.length) {
      setSearched(true);
      setFiltered(result);
    } else {
      toast.error('Nenhum resultado encontrado.');
    }
  };

  const clean = () => {
    setFiltered([]);
    setSearched(false);
  };

  const gamesList = searched ? filtered : games;

  return (
    <Box>
      {!loading ? (
        <Box>
          <FlexBox justifyContent="end">
            <MuiSearch width="34%" search={search} clean={clean} />
          </FlexBox>

          {selected !== undefined && (
            <GameDialog
              data={selected}
              onClose={() => setSelected(undefined)}
              setProject={setProject}
              project={project}
            />
          )}

          {newGame && (
            <NewGameDialog
              onClose={() => setNewGame(false)}
              setProject={setProject}
              project={project}
            />
          )}

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card
                onClick={() => setNewGame(true)}
                sx={{
                  height: 116,
                  cursor: 'pointer',
                  background: '#f3f4f6b5'
                }}
              >
                <CardContent sx={{ height: '100%' }}>
                  <FlexBox
                    sx={{ height: '100%' }}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box textAlign="center">
                      <i
                        className="fi fi-br-plus"
                        style={{ color: '#5742b9' }}
                      />

                      <Paragraph
                        fontWeight={600}
                        sx={{ mt: 1 }}
                        color="text.default"
                      >
                        Novo Padrão
                      </Paragraph>
                    </Box>
                  </FlexBox>
                </CardContent>
              </Card>
            </Grid>

            {gamesList.map((signal, index) => {
              return (
                <Grid item xs={12} md={6} key={index}>
                  <Box>
                    <Card
                      onClick={() => setSelected(signal)}
                      sx={{
                        cursor: 'pointer',
                        opacity: signal.actived ? '(1)' : '0.7'
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ borderRadius: '14% !important' }}
                            src={signal.image}
                          />
                        }
                        title={
                          <H5
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              width: 190,
                              textOverflow: 'ellipsis',
                              display: 'block'
                            }}
                          >
                            {signal.name}
                          </H5>
                        }
                        subheader={
                          <FlexBox alignItems="center" gap={0.5}>
                            <i
                              className="fi fi-sr-crown"
                              style={{
                                color: signal.premium ? '#f0c22d' : '#c4c9d3',
                                fontSize: '12px',
                                marginBottom: -5
                              }}
                            />
                            <Paragraph color="text.disabled" fontSize="12px">
                              {signal.premium ? 'Premium' : 'Básico'}
                            </Paragraph>
                          </FlexBox>
                        }
                        action={
                          <Tiny
                            sx={{ mr: 1 }}
                            fontWeight={600}
                            color={signal.actived ? '#28e657' : '#f85c5c'}
                          >
                            {signal.actived ? 'ON' : 'OFF'}
                          </Tiny>
                        }
                      />
                      <CardContent sx={{ mt: -1.5, mb: -1 }}>
                        <FlexBox gap={1} mt={0.2}>
                          <Chip
                            variant="contained"
                            size="small"
                            sx={{
                              borderRadius: '6px !important',
                              height: 20,
                              background: '#e4e1f4',
                              color: '#5742b9',
                              fontWeight: 600
                            }}
                            label={<Tiny>{signal.assertiveness}%</Tiny>}
                          />
                          <Chip
                            variant="contained"
                            size="small"
                            sx={{
                              borderRadius: '6px !important',
                              height: 20,
                              background: '#e4e1f4',
                              color: '#5742b9',
                              fontWeight: 600
                            }}
                            label={
                              <Tiny>
                                {formatSeconds(signal.expirationTime)}
                              </Tiny>
                            }
                          />
                          <Chip
                            variant="contained"
                            size="small"
                            sx={{
                              borderRadius: '6px !important',
                              height: 20,
                              background: '#e4e1f4',
                              color: '#5742b9',
                              fontWeight: 600
                            }}
                            label={<Tiny>{signal.gale} Gale</Tiny>}
                          />
                          {signal.pattern === 'both' ? (
                            <>
                              <Chip
                                variant="contained"
                                size="small"
                                sx={{
                                  borderRadius: '6px !important',
                                  height: 20,
                                  background: '#e4e1f4',
                                  color: '#5742b9',
                                  fontWeight: 600
                                }}
                                label={<Tiny>Venda</Tiny>}
                              />
                              <Chip
                                variant="contained"
                                size="small"
                                sx={{
                                  borderRadius: '6px !important',
                                  height: 20,
                                  background: '#e4e1f4',
                                  color: '#5742b9',
                                  fontWeight: 600
                                }}
                                label={<Tiny>Compra</Tiny>}
                              />
                            </>
                          ) : (
                            <Chip
                              variant="contained"
                              size="small"
                              sx={{
                                borderRadius: '6px !important',
                                height: 20,
                                background: '#e4e1f4',
                                color: '#5742b9',
                                fontWeight: 600
                              }}
                              label={<Tiny>{PATTERNS[signal.pattern]}</Tiny>}
                            />
                          )}{' '}
                        </FlexBox>
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ) : (
        <Box>
          <FlexBox justifyContent="end">
            <Skeleton variant="text" width="20%" animation="wave" />
          </FlexBox>

          <Grid container spacing={2} mt={2}>
            {[1, 2, 3, 4].map(index => (
              <Grid item key={index} xs={12} md={3}>
                <Skeleton
                  variant="circle"
                  height={177}
                  width="100"
                  sx={{ borderRadius: '8px' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
