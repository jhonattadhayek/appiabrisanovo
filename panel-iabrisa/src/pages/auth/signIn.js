import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Box, Grid, InputAdornment, TextField } from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H2, Paragraph, Span } from 'components/typography';
import useAuth from 'hooks/useAuth';

export default function SignIn() {
  const { loginByEmail } = useAuth();

  const location = useLocation();
  const params = Object.fromEntries(new URLSearchParams(location.search));

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async form => {
    setLoading(true);

    try {
      await loginByEmail(form.email, params);
    } catch (error) {
      toast.error(error.message || 'Oops! Algo inesperado aconteceu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexBox sx={{ flexDirection: 'column', gap: '1.5rem' }}>
      <Box textAlign="center">
        <FlexBox alignItems="center" justifyContent="center" gap={0.5}>
          <H2 fontSize="1.9rem" fontWeight={700}>
            AI Trader
          </H2>
          <Span
            sx={{
              background: '#5742b9',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '4px',
              padding: '0px 6px'
            }}
          >
            PRO
          </Span>
        </FlexBox>

        <Paragraph fontSize="16px" color="text.disabled">
          Bem-vindo, Faça login para continuar
        </Paragraph>
      </Box>

      <Box>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="Digite seu e-mail"
                autoComplete="email"
                type="email"
                {...register('email', {
                  required: 'O E-mail é obrigatório',
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: 'E-mail inválido'
                  }
                })}
                sx={{ '& > .MuiInputBase-root': { height: 44 } }}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i
                        className="fi fi-rr-envelope"
                        style={{ color: '#818999', marginTop: 4 }}
                      />
                    </InputAdornment>
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
                  height: 44,
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                Entrar com e-mail
              </MuiButton>
            </Grid>
          </Grid>
        </form>
      </Box>
    </FlexBox>
  );
}
