import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill from 'react-quill';

import { Box, Grid, TextField } from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiSwitch from 'components/mui/switch';
import { H4, Paragraph, Small, Span } from 'components/typography';

export default function Premium() {
  const { register, control } = useFormContext();

  return (
    <Box>
      <FlexBox alignItems="center" justifyContent="space-between">
        <FlexBox alignItems="center" gap={1}>
          <FlexBox
            justifyContent="center"
            alignItems="center"
            sx={{
              width: 30,
              height: 30,
              background: '#5842bc24',
              color: '#5742b9',
              borderRadius: '4px'
            }}
          >
            <i
              className="fi fi-sr-crown"
              style={{ fontSize: '14px', marginBottom: -3 }}
            />
          </FlexBox>

          <H4>Plano Premium</H4>
        </FlexBox>

        <Controller
          name="pages.premium.actived"
          control={control}
          render={({ field }) => (
            <FlexBox alignItems="center" gap={1}>
              <MuiSwitch {...field} checked={field.value} />
              <Paragraph fontWeight={500}>
                {field.value ? (
                  <Span
                    color="#03543f"
                    fontSize="12px"
                    sx={{
                      background: '#def7ec',
                      p: '0px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    Ativo
                  </Span>
                ) : (
                  <Span
                    color="#cb2323"
                    fontSize="12px"
                    sx={{
                      background: '#f7dede',
                      p: '0px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    Inativo
                  </Span>
                )}
              </Paragraph>
            </FlexBox>
          )}
        />
      </FlexBox>

      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box mb={0.5}>
              <Small fontWeight={500} color="text.disabled">
                Título
              </Small>
            </Box>

            <TextField
              fullWidth
              {...register('pages.premium.title')}
              sx={{ '& > .MuiInputBase-root': { height: 45 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={0.5}>
              <Small fontWeight={500} color="text.disabled">
                Texto do Botão
              </Small>
            </Box>

            <TextField
              fullWidth
              {...register('pages.premium.cta')}
              sx={{ '& > .MuiInputBase-root': { height: 45 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={0.5}>
              <Small fontWeight={500} color="text.disabled">
                Checkout URL
              </Small>
            </Box>

            <TextField
              fullWidth
              {...register('pages.premium.URL')}
              sx={{ '& > .MuiInputBase-root': { height: 45 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box mb={0.5}>
              <Small fontWeight={500} color="text.disabled">
                Descrição
              </Small>
            </Box>

            <Controller
              name="pages.premium.description"
              control={control}
              render={({ field, fieldState }) => (
                <ReactQuill
                  theme="snow"
                  modules={{ toolbar: ['bold', 'italic', 'underline'] }}
                  value={field.value || ''}
                  onChange={field.onChange}
                  className={fieldState.error ? 'quill-error' : ''}
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
