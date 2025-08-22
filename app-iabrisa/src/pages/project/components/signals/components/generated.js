import React, { useEffect, useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider
} from '@mui/material';
import axios from 'axios';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H5, Paragraph, Span } from 'components/typography';
import { formatSeconds } from 'utils/string';

export default function OBSignalGenerated(props) {
  const { game } = props;

  const [reload, setReload] = useState(false);
  const [currentPair, setCurrentPair] = useState('');
  const [loading, setLoading] = useState(true);
  const [disabledButton, setDisabledButton] = useState(false);
  const [signal, setSignal] = useState(undefined);
  const [counter, setCounter] = useState(30);
  const [isCounter, setIsCounter] = useState(false);

  const signalInfo = {
    put: {
      icon: 'fi fi-sr-caret-down',
      color: '#bf3d3d',
      label: 'Venda'
    },
    call: {
      icon: 'fi fi-sr-caret-up',
      color: '#19c540',
      label: 'Compra'
    }
  };

  useEffect(() => {
    if (isCounter) {
      const handleCountTimer = () => {
        setTimeout(() => {
          const result = counter - 1;

          if (result === 0) {
            setIsCounter(false);
            setDisabledButton(false);
            setCounter(30);
          }

          if (result > 0) {
            setCounter(result);
          }
        }, 1000);
      };

      handleCountTimer();
    }
  }, [isCounter, counter]);

  useEffect(() => {
    let timeoutEffect;
    let attempts = 0;
    let timeoutId;
    const maxAttempts = 10;

    const fetchCatalogerId = async () => {
      const active = [];

      game.currencyPairs.map(pair =>
        active.push({
          value: `${pair.label.replace('/', '')}-op`,
          label: pair.label.replace('/', '')
        })
      );

      const filters = () => {
        if (game.pattern) {
          return { call: true, put: true };
        }

        return {
          call: game.pattern === 'call',
          put: game.pattern === 'put'
        };
      };

      const body = {
        active,
        rates: { fixed: 10, g1: 20, g2: 30, g3: 29 },
        filters: filters(),
        timeframe: game.expirationTime / 60,
        days: 5,
        date: 'today',
        news: false,
        gale: game.gale
      };

      try {
        const { data } = await axios.post(
          'https://sio.tools/iqoption/cataloger',
          body
        );

        return data.id;
      } catch (error) {
        console.error('Erro ao buscar catalogador:', error);
        return null;
      }
    };

    const getList = async id => {
      try {
        const { data } = await axios.get(
          `https://sio.tools/iqoption/cataloger/${id}`
        );

        return data.signals;
      } catch (error) {
        console.error('Erro ao buscar lista:', error);
        return [];
      }
    };

    const fetchListRecursively = async id => {
      if (attempts >= maxAttempts) {
        clearTimeout(timeoutId);

        setReload(false);
        setTimeout(() => setReload(true), 100);
        return;
      }

      attempts++;
      const list = await getList(id);

      if (list.length === 0) {
        timeoutId = setTimeout(() => fetchListRecursively(id), 5000);
      } else {
        clearTimeout(timeoutEffect);
        setReload(false);
        setLoading(false);
        generateSignal(list);
      }
    };

    const startOptions = () => {
      timeoutEffect = setTimeout(() => {
        const index = Math.floor(Math.random() * game.currencyPairs.length);
        const pair = game.currencyPairs[index].label;

        setCurrentPair(pair);
        startOptions();
      }, 200);
    };

    const init = async () => {
      startOptions();

      const id = await fetchCatalogerId();
      if (!id) return;

      fetchListRecursively(id);
    };

    if (reload) {
      setSignal(undefined);
      setDisabledButton(true);
      setLoading(true);

      init();
    }

    return () => clearTimeout(timeoutEffect);
  }, [reload]);

  const generateSignal = list => {
    const selectedPair =
      game.currencyPairs[Math.floor(Math.random() * game.currencyPairs.length)];

    const currentDate = new Date();

    const filteredList = list
      .map(item => {
        // eslint-disable-next-line no-unused-vars
        const [_, pair, time, direction] = item.split(';');
        return { pair, time, direction };
      })
      .filter(
        item => item.pair === `${selectedPair.label.replace('/', '')}-op`
      );

    if (filteredList.length === 0) {
      return null; // Se não encontrar sinais para a moeda
    }

    const toMinutes = time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const currentMinutes =
      currentDate.getHours() * 60 + currentDate.getMinutes();

    // Filtrar horários que sejam APENAS para frente do horário atual
    const futureSignals = filteredList.filter(
      item => toMinutes(item.time) > currentMinutes
    );

    if (futureSignals.length === 0) {
      return null; // Se não houver sinais futuros
    }

    const nextSignal = futureSignals.reduce((prev, curr) =>
      toMinutes(curr.time) < toMinutes(prev.time) ? curr : prev
    );

    const signalConfig = {
      pair: selectedPair,
      time: nextSignal.time,
      action: nextSignal.direction.toLowerCase()
    };

    setSignal(signalConfig);

    const sound = document.getElementById('sound');
    if (sound) {
      sound.volume = 0.5;
      sound.play();
    }

    setIsCounter(true);
  };

  return (
    <Card sx={{ boxShadow: '0px 4px 23px rgb(25 31 36) !important' }}>
      <CardContent sx={{ p: '16px' }}>
        <FlexBox justifyContent="space-between" alignItems="center">
          <Box>
            <FlexBox gap={1} alignItems="baseline">
              <H5
                fontWeight={700}
                fontSize="24px"
                sx={{
                  ...(loading &&
                    !currentPair && {
                      filter: 'blur(8px)',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    })
                }}
              >
                {signal ? signal?.pair?.label : currentPair || 'ABC/XYZ'}
              </H5>

              {isCounter && (
                <Span color="text.disabled" fontSize="12px" fontWeight={700}>
                  ({counter})
                </Span>
              )}
            </FlexBox>

            <Divider sx={{ mt: 0.6, mb: 1 }} />
            <FlexBox alignItems="center" gap={1.8}>
              <FlexBox
                alignItems="center"
                gap={0.6}
                sx={{
                  ...(loading && {
                    filter: 'blur(5px)',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  })
                }}
              >
                <i
                  className="fi fi-rr-clock-two"
                  style={{
                    color: '#818999',
                    fontSize: '12px',
                    marginBottom: -3
                  }}
                />
                <Paragraph
                  color="text.disabled"
                  fontSize="12px"
                  fontWeight={900}
                >
                  {signal?.time}
                </Paragraph>
              </FlexBox>

              <FlexBox
                alignItems="center"
                gap={0.6}
                sx={{
                  ...(loading && {
                    filter: 'blur(5px)',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  })
                }}
              >
                <i
                  className="fi fi-sr-time-half-past"
                  style={{
                    color: '#818999',
                    fontSize: '12px',
                    marginBottom: -3
                  }}
                />
                <Paragraph
                  color="text.disabled"
                  fontSize="12px"
                  fontWeight={900}
                >
                  {game.expirationTime
                    ? formatSeconds(game.expirationTime)
                    : '---'}
                </Paragraph>
              </FlexBox>
            </FlexBox>
          </Box>

          {!signal && (
            <FlexBox
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              sx={{
                width: 65,
                height: 55,
                background: '#00000059',
                borderRadius: 1
              }}
            >
              <Box
                sx={{
                  ...(loading &&
                    !currentPair && {
                      filter: 'blur(5px)',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    })
                }}
              >
                {loading && !currentPair ? (
                  <i
                    className="fi fi-rr-cross-small"
                    style={{ fontSize: '18px', marginBottom: -5 }}
                  />
                ) : (
                  <CircularProgress size="14px" sx={{ color: '#fff' }} />
                )}
              </Box>
            </FlexBox>
          )}

          {signal && (
            <FlexBox
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              sx={{
                mb: -0.5,
                width: 65,
                height: 55,
                background: signalInfo[signal.action].color,
                borderRadius: 1,
                border: `1px solid ${signalInfo[signal.action].color}`,
                boxShadow: `0 0 5px ${
                  signalInfo[signal.action].color
                }, 0 0 10px ${signalInfo[signal.action].color}, 0 0 15px ${
                  signalInfo[signal.action].color
                }`
              }}
            >
              <Box sx={{ mt: -0.6 }}>
                <i
                  className={signalInfo[signal.action].icon}
                  style={{ fontSize: '30px' }}
                />
                <Paragraph sx={{ mt: -2.5 }} fontSize="14px" fontWeight={700}>
                  {signalInfo[signal.action].label}
                </Paragraph>
              </Box>
            </FlexBox>
          )}
        </FlexBox>

        {game.type === 'generated' && (
          <Box mt={2.5} mb={-0.5}>
            <MuiButton
              fullWidth
              variant="contained"
              onClick={() => setReload(true)}
              disabled={disabledButton}
              sx={{
                filter: disabledButton ? 'opacity(0.7)' : 'opacity(1)',
                color: '#fff !important',
                backgroundImage:
                  'linear-gradient(204deg, #00D11D 0%, #1C8300 100%)',
                '&:hover': {
                  backgroundImage:
                    'linear-gradient(204deg, #00D11D 0%, #1C8300 100%)'
                }
              }}
            >
              IDENTIFICAR OPORTUNIDADE
            </MuiButton>
          </Box>
        )}

        {game.gale && signal && (
          <Box textAlign="center" mt={2} mb={-1}>
            <Paragraph fontSize="14px" fontWeight={600} color="text.disabled">
              Faça até 0{game.gale} proteções
            </Paragraph>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
