import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  Avatar,
  alpha,
  IconButton
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H2, Paragraph, Span } from 'components/typography';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const { app } = useApp();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm();

  const onSubmit = async form => {
    setLoading(true);

    try {
      await login({
        email: form.email,
        password: form.password,
        id: app?.id
      });
    } catch (error) {
      toast.error(error.message || 'Oops! Algo inesperado aconteceu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexBox sx={{ flexDirection: 'column', gap: '1.5rem' }}>
      <Box textAlign="center">
        {app?.pages?.login?.logoURL ? (
          <FlexBox justifyContent="center" sx={{ mb: 2 }}>
            <Avatar
              src={app?.pages?.login?.logoURL}
              sx={{ width: 128, height: 128, borderRadius: '16%' }}
              alt={app?.name}
            />
          </FlexBox>
        ) : (
          <H2 fontSize="1.4rem" fontWeight={900}>
            {app?.name}
          </H2>
        )}
        <Paragraph fontSize="16px" color="#edecec">
          {app?.pages?.login?.title}
        </Paragraph>
      </Box>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <TextField
                sx={{
                  '& > .MuiInputBase-root': {
                    background: '#15191e',
                    height: 44
                  }
                }}
                {...register('email', {
                  required: 'O E-mail é obrigatório',
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: 'E-mail inválido'
                  }
                })}
                placeholder="Digite seu e-mail"
                autoComplete="email"
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i
                        className="fi fi-rr-envelope"
                        style={{ color: '#818999', marginBottom: -5 }}
                      />
                    </InputAdornment>
                  )
                }}
                fullWidth={true}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                sx={{
                  '& > .MuiInputBase-root': {
                    background: '#15191e',
                    height: 44
                  }
                }}
                {...register('password', {
                  required: 'A senha é obrigatória'
                })}
                error={!!errors.password}
                placeholder="Sua senha"
                helperText={errors.password?.message}
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i
                        className="fi fi-rr-lock"
                        style={{ color: '#818999', marginBottom: -5 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: showPassword ? (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      <i
                        className="fi fi-rr-eye"
                        style={{
                          color: '#818999',
                          marginBottom: -5,
                          fontSize: '18px'
                        }}
                      />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      <i
                        className="fi fi-rr-eye-crossed"
                        style={{
                          color: '#818999',
                          marginBottom: -5,
                          fontSize: '18px'
                        }}
                      />
                    </IconButton>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <MuiButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={loading}
                sx={{
                  mt: 1,
                  height: 44,
                  fontSize: '16px',
                  fontWeight: 600,
                  background: app?.theme?.primaryColor,
                  '&:hover': { background: app?.theme?.primaryColor }
                }}
              >
                Entrar
              </MuiButton>
            </Grid>
          </Grid>
        </form>

        <Box textAlign="center" mt={4}>
          <Span>Não possui uma conta?</Span>

          <Link to={app?.settings?.affiliateLink} target="_blank">
            <MuiButton
              variant="outlined"
              fullWidth
              sx={{
                mt: 1.5,
                height: 44,
                fontSize: '14px',
                fontWeight: 600,
                background: 'transparent',
                borderColor: alpha(app?.theme?.primaryColor, 0.2),
                color: app?.theme?.primaryColor,
                '&:hover': {
                  background: 'transparent',
                  borderColor: alpha(app?.theme?.primaryColor, 0.2),
                  color: app?.theme?.primaryColor
                }
              }}
            >
              Criar conta
            </MuiButton>
          </Link>
        </Box>
      </Box>

      <Box mt={2} textAlign="center" lineHeight={1.3}>
        <i
          className="fi fi-rr-age-restriction-eighteen"
          style={{ color: '#818999', fontSize: '20px' }}
        />
        {app.type === 'igaming' && (
          <Paragraph color="text.disabled" fontSize="12px">
            Não oferecemos garantia de lucro em jogos de Cassino. Somente para
            maiores de 18 anos. Jogue com Responsabilidade.
          </Paragraph>
        )}

        {app.type === 'ob' && (
          <Paragraph color="text.disabled" fontSize="12px">
            Este aplicativo não realiza operações financeiras em nome dos
            usuários e não garantimos lucros ou resultados específicos.
          </Paragraph>
        )}
      </Box>
    </FlexBox>
  );
}
