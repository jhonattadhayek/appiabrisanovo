import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AppBar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  styled,
  TextField,
  Toolbar
} from '@mui/material';
import FlexBox from 'components/flexBox';
import LoadingScreen from 'components/loadingScreen';
import MuiButton from 'components/mui/button';
import PremiumCard from 'components/premiumCard';
import { H2, H5, Paragraph, Tiny } from 'components/typography';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';
import { formatCurrency } from 'utils/formatter';

import OBSignalGenerated from './components/generated';
import OBSignal from './components/signal';

export default function Signals() {
  const { app } = useApp();
  const { user } = useAuth();
  const { search } = useLocation();
  const hasRun = useRef(false);

  const [game, setGame] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [running, setRunning] = useState(false);
  const [initialBalance, setInitialBalance] = useState(null);
  const [finalBalance, setFinalBalance] = useState(null);
  const [updateBalance, setUpdateBalance] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [message, setMessage] = useState('Clique em INICIAR para começar');
  const [errorInput, setErrorInput] = useState(null);
  const [valueInput, setValueInput] = useState(0);
  const [metaInput, setMetaInput] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [reload, setReload] = useState(false);
  const [alertMessage, setAlertMessage] = useState(true);

  const [logs, setLogs] = useState([]);

  const [config, setConfig] = useState({
    value: 0,
    gale: 2,
    timeframe: 0,
    meta: 0,
    stopLoss: 0,
    clientType: 0
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const lastConfig = JSON.parse(localStorage.getItem('config'));
    if (lastConfig) {
      setConfig(prevConfig => ({ ...prevConfig, ...lastConfig }));
    }
  }, [config]);

  useEffect(() => {
    localStorage.setItem('config', JSON.stringify({ config }));
    return () => localStorage.removeItem('config');
  }, [config]);

  useEffect(() => {
    let isInitial = true;

    const getBalance = async () => {
      // ToDO => Trocar essa constante pelo valor da API
      const amountBalance = 0.0;

      if (isInitial) {
        setUpdateBalance(amountBalance);
        setInitialBalance(amountBalance);
        isInitial = false;
      }

      setBalance(amountBalance);
    };

    getBalance();
  }, [user]);

  useEffect(() => {
    if (!hasRun.current && balance) {
      calculate(config.clientType);
      hasRun.current = true;
    }
  }, [balance]);

  useEffect(() => {
    if (app && search) {
      const getQueryValue = key => {
        const params = new URLSearchParams(search);
        return params.get(key);
      };

      const gameId = getQueryValue('id');

      const result = app.games.filter(
        game => game.id === gameId && game.actived === true
      )[0];

      if (result) {
        setConfig(prevConfig => ({
          ...prevConfig,
          timeframe: result.expirationTime
        }));
      }

      setGameId(gameId);
      setGame(result);
    }
  }, [app, search]);

  const calculate = clientType => {
    const parseCurrency = balance => {
      if (balance.includes('R$')) {
        return (
          parseFloat(balance.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
        );
      }

      return parseFloat(balance.replace('$', '').replace(/,/g, ''));
    };

    const action = (balance, clientType) => {
      let percentage = 0;

      if (clientType === 0) percentage = 0.015; // Média de 1-2%
      if (clientType === 1) percentage = 0.03; // 3%
      if (clientType === 2) percentage = 0.045; // Média de 4-5%

      setValueInput(parseFloat((balance * percentage).toFixed(2)));
      setMetaInput(parseFloat((balance * percentage * 3).toFixed(2)));

      return {
        value: parseFloat((balance * percentage).toFixed(2)),
        meta: parseFloat((balance * percentage * 3).toFixed(2)),
        stopLoss: 2
      };
    };

    setConfig(prevConfig => ({
      ...prevConfig,
      ...action(parseCurrency(balance), clientType)
    }));
  };

  const handleChangeType = type => {
    calculate(type);
    setConfig(prevConfig => ({ ...prevConfig, clientType: type }));
  };

  const handleChangeField = e => {
    const value = e.target.value;

    if (e.target.name === 'value' || e.target.name === 'meta') {
      const numericString = value.replace(/[^0-9]/g, '');

      const numericValue = parseFloat(numericString) / 100;

      if (e.target.name === 'value') {
        setValueInput(numericString);
      } else {
        setMetaInput(numericString);
      }

      setConfig(prevConfig => ({
        ...prevConfig,
        [e.target.name]: numericValue
      }));
    } else {
      setConfig(prevConfig => ({
        ...prevConfig,
        [e.target.name]: Number(value)
      }));
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

  const handleMessages = type => {
    const m = {
      init: 'Clique em INICIAR para começar',
      start: 'Começando a operação automática...',
      new_signal: `Oportunidade encontrada: ${type.options?.direction}`,
      await_timer: 'Aguardando o horário da entrada',
      entry_success: 'Entrada realizada com sucesso',
      first_gale: 'Aplicando a primeira proteção',
      second_gale: 'Aplicando a segunda proteção',
      win: 'GREEENNN 🎉',
      loss: 'RED ❌',
      stop_loss: `Pausando operação: ${config.stopLoss} Loss`,
      meta_achieved: 'Parabéns! Meta atingida 🎉',
      restart: 'Começando um nova operação',
      fail: 'Ativo indisponível no momento',
      paused: 'Operação automática pausada'
    };

    setMessage(m[type.tag]);
  };

  const handleStopBot = props => {
    handleMessages({ tag: props.type });
    setRunning(false);
  };

  const handleLogsBot = props => {
    if (props.status === 'init') {
      setLogs(prevLogs => [
        {
          time: props.time,
          direction: props.direction,
          value: props.value,
          profit: null
        },
        ...prevLogs
      ]);
    } else {
      setLogs(prevLogs => {
        const updatedLogs = [...prevLogs];

        if (updatedLogs.length > 0) {
          updatedLogs[0] = {
            ...updatedLogs[0],
            ...props
          };
        }

        return updatedLogs;
      });
    }
  };

  const handleStartBot = () => {
    if (running) {
      handleMessages({ tag: 'init' });
      setRunning(false);
    } else {
      const type = localStorage.getItem('type');
      const min = type === 'demo' ? 1 : 5;

      if (config.value >= min) {
        handleMessages({ tag: 'start' });
        setExpanded(false);
        setRunning(true);
        setReload(true);
      } else {
        setErrorInput(`O valor mínimo é ${type === 'demo' ? '$1' : 'R$ 5,00'}`);
      }
    }
  };

  const diffValue = handleDiffBalance(initialBalance, finalBalance);

  return game ? (
    <Box pb={5}>
      <NavbarRoot position="static">
        <StyledToolBar>
          <Link
            to={`/${app?.slug}/app?tab=${game.premium ? 'premium' : 'inicio'}`}
          >
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
              <i
                className="fi fi-rr-angle-small-left"
                style={{
                  color: '#fff',
                  fontSize: '15px',
                  marginBottom: -4
                }}
              />
            </IconButton>
          </Link>

          <Box ml={1.5}>
            <H2 color="#fff" fontWeight={500}>
              {game?.name}
            </H2>
          </Box>
        </StyledToolBar>
      </NavbarRoot>

      <Box mt={1.5}>
        {game.premium && user?.signature === 'free' ? (
          <PremiumCard />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {game.type === 'generated' ? (
                <OBSignalGenerated game={game} gameId={gameId} />
              ) : (
                <OBSignal
                  game={game}
                  gameId={gameId}
                  config={config}
                  running={running}
                  initialBalance={initialBalance}
                  balance={balance}
                  diffValue={diffValue}
                  reload={reload}
                  setFinalBalance={setFinalBalance}
                  setUpdateBalance={setUpdateBalance}
                  handleStopBot={handleStopBot}
                  handleLogsBot={handleLogsBot}
                  handleMessages={handleMessages}
                  setReload={setReload}
                />
              )}
            </Grid>

            {game.type === 'generated' ? (
              <Grid item xs={12}>
                {alertMessage && (
                  <Alert
                    severity="error"
                    onClose={() => setAlertMessage(false)}
                  >
                    <Paragraph>
                      Faça login e configue a corretora antes de buscar
                      oportunidades.
                    </Paragraph>
                  </Alert>
                )}

                <Card sx={{ width: '100%', mt: 2 }}>
                  <iframe
                    style={{ border: 'none' }}
                    width="100%"
                    height="687"
                    src={app?.settings?.affiliateLink}
                    referrerPolicy="unsafe-url"
                  />
                </Card>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Box mt={2}>
                  <Card
                    sx={{
                      background: 'transparent',
                      border: '1px solid #21282d !important'
                    }}
                  >
                    <CardContent>
                      <FlexBox justifyContent="space-between">
                        <Box>
                          <Tiny color="text.disabled">SALDO TOTAL</Tiny>
                          <Paragraph fontSize="20px" fontWeight={600}>
                            {updateBalance}
                          </Paragraph>
                        </Box>

                        <Box>
                          <Tiny color="text.disabled">LUCRO / PREJUIZO</Tiny>
                          <Paragraph
                            fontSize="20px"
                            fontWeight={600}
                            color={
                              diffValue.indexOf('-') > -1
                                ? diffValue.indexOf('---') > -1
                                  ? '#fff'
                                  : '#fa8282'
                                : '#82faa7'
                            }
                          >
                            {diffValue}
                          </Paragraph>
                        </Box>
                      </FlexBox>
                    </CardContent>
                  </Card>

                  <Card
                    sx={{
                      mt: 2,
                      background: 'transparent',
                      border: '1px solid #21282d !important'
                    }}
                  >
                    <CardContent>
                      {message && (
                        <FlexBox
                          alignItems="center"
                          gap={2}
                          mb={logs.length > 0 ? 2 : 0}
                        >
                          <i
                            className="fi fi-rr-user-robot"
                            style={{ marginBottom: -4 }}
                          />

                          <Box
                            sx={{
                              backgroundColor: '#191f24',
                              padding: '8px 12px',
                              borderRadius: '10px',
                              position: 'relative',
                              width: '100%',
                              '&::before': {
                                content: `""`,
                                position: 'absolute',
                                top: '50%',
                                left: '-10px',
                                width: 0,
                                height: 0,
                                borderTop: '10px solid transparent',
                                borderBottom: '10px solid transparent',
                                borderRight: '10px solid #191f24',
                                transform: 'translateY(-50%)'
                              }
                            }}
                          >
                            <Paragraph>
                              {message}

                              {message ===
                                'Aguardando o horário da entrada' && (
                                <CircularProgress
                                  size="12px"
                                  sx={{ color: '#fff', ml: 3, mb: -0.1 }}
                                />
                              )}
                            </Paragraph>
                          </Box>
                        </FlexBox>
                      )}

                      {logs.length > 0 && (
                        <Box>
                          <Divider sx={{ mb: 2, borderColor: '#14191c' }} />

                          {logs.map((elem, index) => {
                            return (
                              <Grid container key={index} spacing={0}>
                                <Grid item xs={2} mb={1.5}>
                                  <Box>
                                    <Tiny color="text.disabled">Hora</Tiny>
                                    <Paragraph>{elem.time}</Paragraph>
                                  </Box>
                                </Grid>

                                <Grid item xs={3.5} mb={1.5}>
                                  <Box textAlign="center">
                                    <Tiny color="text.disabled">Mercado</Tiny>
                                    <Paragraph>
                                      {elem.direction === 'call'
                                        ? 'Compra'
                                        : 'Venda'}
                                    </Paragraph>
                                  </Box>
                                </Grid>

                                <Grid item xs={3.5} mb={1.5}>
                                  <Box textAlign="center">
                                    <Tiny color="text.disabled">Entrada</Tiny>
                                    <Paragraph>
                                      {formatCurrency(
                                        elem.value,
                                        localStorage.getItem('type') === 'real'
                                          ? 'BRL'
                                          : 'USD'
                                      )}
                                    </Paragraph>
                                  </Box>
                                </Grid>

                                <Grid item xs={3} mb={1.5}>
                                  <Box textAlign="end">
                                    <Tiny color="text.disabled">Ganhos</Tiny>
                                    <Box>
                                      {elem.profit ? (
                                        <Paragraph>
                                          {formatCurrency(
                                            elem.profit,
                                            localStorage.getItem('type') ===
                                              'real'
                                              ? 'BRL'
                                              : 'USD'
                                          )}
                                        </Paragraph>
                                      ) : (
                                        <CircularProgress
                                          size="13px"
                                          sx={{ color: '#fff', mr: 1.5 }}
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            );
                          })}
                        </Box>
                      )}
                    </CardContent>
                  </Card>

                  <Accordion
                    expanded={expanded}
                    onChange={() => setExpanded(!expanded)}
                    sx={{
                      borderRadius: 2,
                      mt: 2,
                      background: 'transparent',
                      border: '1px solid #21282d !important',
                      '&::before': {
                        backgroundColor: 'transparent !important'
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon sx={{ color: '#fff', m: 1 }} />
                      }
                    >
                      <Box px={1.5} py={2}>
                        <H5>Configurações</H5>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box px={1.5} mt={-1}>
                        <FlexBox justifyContent="space-between" gap={1} mt={2}>
                          <MuiButton
                            variant="contained"
                            onClick={() => handleChangeType(0)}
                            fullWidth
                            sx={{
                              background:
                                config.clientType === 0 ? '#43a047' : '#191f24',
                              '&:hover': {
                                background:
                                  config.clientType === 0
                                    ? '#43a047'
                                    : '#191f24'
                              }
                            }}
                          >
                            Conservador
                          </MuiButton>

                          <MuiButton
                            variant="contained"
                            onClick={() => handleChangeType(1)}
                            fullWidth
                            sx={{
                              background:
                                config.clientType === 1 ? '#43a047' : '#191f24',
                              '&:hover': {
                                background:
                                  config.clientType === 1
                                    ? '#43a047'
                                    : '#191f24'
                              }
                            }}
                          >
                            Moderado
                          </MuiButton>

                          <MuiButton
                            variant="contained"
                            onClick={() => handleChangeType(2)}
                            fullWidth
                            sx={{
                              background:
                                config.clientType === 2 ? '#43a047' : '#191f24',
                              '&:hover': {
                                background:
                                  config.clientType === 2
                                    ? '#43a047'
                                    : '#191f24'
                              }
                            }}
                          >
                            Agressivo
                          </MuiButton>
                        </FlexBox>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={12}>
                            <Tiny color="text.disabled">Valor da Entrada</Tiny>

                            <Box mt={1}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="value"
                                onChange={handleChangeField}
                                error={errorInput !== null}
                                helperText={errorInput}
                                onFocus={() => setIsEditing(true)}
                                onBlur={() => setIsEditing(false)}
                                value={formatCurrency(
                                  valueInput,
                                  localStorage.getItem('type') === 'real'
                                    ? 'BRL'
                                    : 'USD',
                                  isEditing
                                )}
                                sx={{
                                  '& > .MuiInputBase-root': {
                                    background: '#15191e'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={6}>
                            <Tiny color="text.disabled">Meta de Lucro</Tiny>

                            <Box mt={1}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="meta"
                                onChange={handleChangeField}
                                onFocus={() => setIsEditing(true)}
                                onBlur={() => setIsEditing(false)}
                                value={formatCurrency(
                                  metaInput,
                                  localStorage.getItem('type') === 'real'
                                    ? 'BRL'
                                    : 'USD',
                                  isEditing
                                )}
                                sx={{
                                  '& > .MuiInputBase-root': {
                                    background: '#15191e'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={3}>
                            <Tiny color="text.disabled">Proteções</Tiny>

                            <Box mt={1}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                name="gale"
                                onChange={handleChangeField}
                                value={config.gale}
                                placeholder="0"
                                type="number"
                                sx={{
                                  '& > .MuiInputBase-root': {
                                    background: '#15191e'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={3}>
                            <Tiny color="text.disabled">Stop Loss</Tiny>

                            <Box mt={1}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="0"
                                name="stopLoss"
                                type="number"
                                onChange={handleChangeField}
                                value={config.stopLoss}
                                sx={{
                                  '& > .MuiInputBase-root': {
                                    background: '#15191e'
                                  }
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  <MuiButton
                    fullWidth
                    variant="contained"
                    onClick={handleStartBot}
                    sx={{
                      mt: 3,
                      color: '#fff !important',
                      backgroundImage: `linear-gradient(204deg, ${
                        running ? '#d10700' : '#00D11D'
                      }  0%, ${running ? '#830f00' : '#1C8300'} 100%)`,
                      '&:hover': {
                        backgroundImage: `linear-gradient(204deg, ${
                          running ? '#d10700' : '#00D11D'
                        }  0%, ${running ? '#830f00' : '#1C8300'} 100%)`
                      }
                    }}
                  >
                    {running ? 'PAUSAR' : 'INICIAR'}
                  </MuiButton>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  ) : (
    <LoadingScreen />
  );
}

const NavbarRoot = styled(AppBar)(({ theme }) => ({
  zIndex: 11,
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
