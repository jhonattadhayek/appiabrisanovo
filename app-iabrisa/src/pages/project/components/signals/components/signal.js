import React, { useEffect, useState } from 'react';

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider
} from '@mui/material';
import { BlitzOptionsDirection } from '@quadcode-tech/client-sdk-js';
import axios from 'axios';
import FlexBox from 'components/flexBox';
import { H5, Paragraph } from 'components/typography';
import useAuth from 'hooks/useAuth';
import { formatSeconds } from 'utils/string';

let intervalTimer = null;

export default function OBSignal(props) {
  const {
    game,
    config,
    running,
    initialBalance,
    setFinalBalance,
    setUpdateBalance,
    handleStopBot,
    handleLogsBot,
    handleMessages,
    reload,
    setReload
  } = props;

  const { user } = useAuth();

  const [currentPair, setCurrentPair] = useState('');
  const [loading, setLoading] = useState(true);
  const [signal, setSignal] = useState(undefined);
  const [countLoss, setCountLoss] = useState(0);
  const [finalBalanceLocal, setFinalBalanceLocal] = useState(null);

  const [event, setEvent] = useState(null);

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

  const handleDiffBalance = (initial, balance) => {
    if (initial && balance) {
      const parseCurrency = balance => {
        if (balance.includes('R$')) {
          return {
            symbol: 'R$',
            numericValue:
              parseFloat(balance.replace(/[^\d,.-]/g, '').replace(',', '.')) ||
              0
          };
        }

        return {
          symbol: '$',
          numericValue: parseFloat(balance.replace('$', '').replace(/,/g, ''))
        };
      };

      const formatMoney = (value, symbol) => {
        const locales = {
          R$: 'pt-BR',
          $: 'en-US'
        };

        const currency = symbol.trim() === 'R$' ? 'BRL' : 'USD';

        return new Intl.NumberFormat(locales[symbol.trim()] || 'en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: 2
        }).format(value);
      };

      const { symbol: symbolInitial, numericValue: initialValue } =
        parseCurrency(initial);

      const { symbol: symbolBalance, numericValue: balanceValue } =
        parseCurrency(balance);

      if (symbolInitial !== symbolBalance) {
        throw new Error('As moedas são diferentes!');
      }

      const diff = balanceValue - initialValue;

      return formatMoney(diff, symbolInitial);
    }

    return '---';
  };

  const diffValue = handleDiffBalance(initialBalance, finalBalanceLocal);

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
        gale: config.gale
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

    if (running) {
      handleMessages({
        tag: 'new_signal',
        options: {
          direction: signalInfo[signalConfig.action].label
        }
      });

      handleAutomaticSignal(signalConfig);

      setTimeout(() => {
        handleMessages({ tag: 'await_timer' });
      }, 5000);
    }
  };

  const getIdPair = signal => {
    if (signal.pair.label === 'BTC/USD') return 2270;
    if (signal.pair.label === 'ETH/USD') return 1941;
  };

  const getDirection = signal => {
    if (signal.action === 'call') return BlitzOptionsDirection.Call;
    if (signal.action === 'put') return BlitzOptionsDirection.Put;
  };

  const handleAutomaticSignal = async signal => {
    if (intervalTimer) {
      clearInterval(intervalTimer);
      intervalTimer = null;
    }

    const [hours, minutes] = signal.time.split(':').map(Number);
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);

    let executed = false;

    const checkTime = async () => {
      const now = new Date();

      if (!executed && now >= targetTime) {
        executed = true;
        clearInterval(intervalTimer);
        intervalTimer = null;

        const blitzOptions = await user.sdk.blitzOptions();
        const active = blitzOptions.getActive(getIdPair(signal));

        if (!active.isSuspended) {
          setEvent({
            active,
            direction: getDirection(signal),
            timeframe: config.timeframe,
            value: config.value
          });
        }
      }
    };

    intervalTimer = setInterval(checkTime, 1000);
  };

  useEffect(() => {
    let gale = 0;
    let entryValue = 0;
    let startAmout = 0;

    const formatMoney = balance => {
      const locale = {
        USD: 'en-US',
        BRL: 'pt-BR'
      };

      return Number(balance.amount).toLocaleString(
        locale[balance.currency] || 'pt-BR',
        {
          style: 'currency',
          currency: balance.currency,
          minimumFractionDigits: 2
        }
      );
    };

    const getBalance = async () => {
      const type = localStorage.getItem('type');
      const balances = await user.sdk.balances();
      return balances
        .getBalances()
        .find(balance => balance.type === (type || 'demo'));
    };

    const parseCurrency = balance => {
      if (balance === '---') return 0;

      if (balance.includes('R$')) {
        return (
          parseFloat(balance.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
        );
      }

      return parseFloat(balance.replace('$', '').replace(/,/g, ''));
    };

    const exec = async () => {
      try {
        if (parseCurrency(diffValue) < config.meta) {
          if (countLoss <= config.stopLoss) {
            if (gale <= config.gale) {
              const currentBalance = await getBalance();
              const blitzOptions = await user.sdk.blitzOptions();

              await blitzOptions.buy(
                event.active,
                event.direction,
                event.timeframe,
                entryValue,
                currentBalance
              );

              if (gale === 0) {
                handleMessages({ tag: 'entry_success' });
              }

              if (gale === 1) {
                handleMessages({ tag: 'first_gale' });
              }

              if (gale === 2) {
                handleMessages({ tag: 'second_gale' });
              }

              handleLogsBot({
                status: gale > 0 ? 'gale' : 'init',
                gale,
                time: signal.time,
                direction: event.direction,
                value: entryValue,
                profit: null
              });

              const getNewBalance = await getBalance();
              const newBalance = parseFloat(
                (getNewBalance.amount - entryValue).toFixed(2)
              );

              setTimeout(async () => {
                const outBalance = await getBalance();

                if (outBalance.amount > newBalance) {
                  handleLogsBot({ action: 'win' });
                  handleMessages({ tag: 'win' });

                  setUpdateBalance(formatMoney(outBalance));
                  setFinalBalance(formatMoney(outBalance));
                  setFinalBalanceLocal(formatMoney(outBalance));

                  handleLogsBot({
                    status: 'win',
                    gale,
                    time: signal.time,
                    direction: event.direction,
                    value: entryValue,
                    profit: parseFloat(
                      (outBalance.amount - startAmout).toFixed(2)
                    )
                  });

                  if (parseCurrency(diffValue) >= config.meta) {
                    handleStopBot({ type: 'meta_achieved' });
                  } else {
                    if (running) {
                      handleMessages({ tag: 'restart' });
                      setReload(true);
                    } else {
                      handleStopBot({ type: 'paused' });
                    }
                  }
                } else {
                  gale++;
                  entryValue = entryValue * 2;

                  exec();
                }
              }, event.timeframe * 1000 + 5000);
            } else {
              setCountLoss(prev => prev++);
              handleLogsBot({ action: 'loss' });
              handleMessages({ tag: 'loss' });

              const myBalance = await getBalance();

              setUpdateBalance(formatMoney(myBalance));
              setFinalBalance(formatMoney(myBalance));
              setFinalBalanceLocal(formatMoney(myBalance));

              handleLogsBot({
                status: 'loss',
                gale,
                time: signal.time,
                direction: event.direction,
                value: entryValue,
                profit: parseFloat((myBalance.amount - startAmout).toFixed(2))
              });

              if (running) {
                handleMessages({ tag: 'restart' });
                setReload(true);
              } else {
                handleStopBot({ type: 'paused' });
              }
            }
          } else {
            handleStopBot({ type: 'stop_loss' });
          }
        } else {
          handleStopBot({ type: 'meta_achieved' });
        }
      } catch (error) {
        console.log(error);
        handleStopBot({ type: 'fail' });
      }
    };

    const getStartAmount = async () => {
      const myBalance = await getBalance();
      startAmout = myBalance.amount;
    };

    if (event !== null) {
      gale = 0;
      entryValue = event.value;
      startAmout = 0;

      getStartAmount();
      exec();
    }
  }, [event]);

  return (
    <Card sx={{ boxShadow: '0px 4px 23px rgb(25 31 36) !important' }}>
      <CardContent sx={{ p: '16px' }}>
        {!signal && (
          <Box mb={2}>
            <Paragraph
              textAlign="center"
              color="text.disabled"
              fontWeight={500}
              id={reload ? 'blinking' : ''}
            >
              {reload
                ? 'Procurando novas oportunidades.'
                : 'Aguandando inicio da operação.'}
            </Paragraph>
          </Box>
        )}

        <FlexBox justifyContent="space-between" alignItems="center">
          <Box>
            <FlexBox alignItems="baseline">
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
                  <CircularProgress
                    size="14px"
                    sx={{ color: '#fff', marginTop: -2 }}
                  />
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

        {signal && (
          <Box textAlign="center" mt={2} mb={-1}>
            <Paragraph fontSize="14px" fontWeight={600} color="text.disabled">
              Faça até 0{config.gale} proteções
            </Paragraph>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
