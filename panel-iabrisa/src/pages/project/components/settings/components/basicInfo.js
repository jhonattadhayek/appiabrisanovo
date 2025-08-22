import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H3, Paragraph, Small, Span, Tiny } from 'components/typography';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';
import { convertImage } from 'utils/image';
import * as yup from 'yup';

export default function BasicInfo({ project, setProject }) {
  const { setUser } = useAuth();

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);

  const infoSchema = yup
    .object()
    .shape({
      name: yup.string().required('O Nome é obrigatório.'),
      slug: yup.string().required('A Slug é obrigatório.'),
      logoURL: yup.string().required('- Obrigatório.')
    })
    .required();

  const {
    handleSubmit,
    register,
    setValue,
    trigger,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(infoSchema),
    shouldFocusError: true,
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      ...project,
      logoURL: project.settings.logoURL
    }
  });

  useEffect(() => {
    reset({ ...project, logoURL: project.settings.logoURL });
  }, [project, reset]);

  const handleChangeFile = async (e, pathname) => {
    const file = e.target.files[0];

    if (file && file.type.includes('image')) {
      const image = await convertImage({ e });

      setValue(pathname, image.url);
      trigger(pathname, { shouldFocus: true });
    } else {
      toast.error('Selecione uma imagem no formato válido');
    }
  };

  const handleSlugChange = e => {
    e.target.value = e.target.value.toLowerCase().replace(/\s+/g, '-');
  };

  const handleFormSubmit = async form => {
    setLoading(true);

    try {
      const body = {
        name: form.name,
        slug: form.slug,
        settings: {
          affiliateLink: form.affiliateLink,
          language: form.language,
          logoURL: form.logoURL,
          scripts: project.settings.scripts
        },
        token: project.token
      };

      const path = '/projects/update/';
      const { data } = await Api.patch(path + project.id, body);

      setProject(data.project);
      setUser();

      toast.success('Dados atualizados com sucesso');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Card>
        <CardHeader
          title={
            <H3 fontSize="16px" fontWeight={500}>
              Informações básicas
            </H3>
          }
          subheader={
            <Span color="text.disabled" fontSize="14px">
              Atualize abaixo para concluir a configuração.
            </Span>
          }
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mt: -2 }}>
            <Grid item xs={12}>
              <Controller
                name="logoURL"
                control={control}
                render={({ field, fieldState }) => (
                  <FlexBox gap={2} mb={2}>
                    {field.value ? (
                      <Box component="label">
                        <Box
                          component="img"
                          height={100}
                          width={100}
                          src={field.value}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: 1,
                            position: 'relative'
                          }}
                        />
                        <input
                          hidden
                          type="file"
                          onChange={e => handleChangeFile(e, 'logoURL')}
                        />
                      </Box>
                    ) : (
                      <Box component="label">
                        <FlexBox
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            background: '#f3f4f6',
                            width: 100,
                            height: 100,
                            borderRadius: 1,
                            cursor: 'pointer',
                            ...(fieldState.error && {
                              border: theme =>
                                `1px solid ${theme.palette.error.main}`
                            })
                          }}
                        >
                          <i
                            className="fi fi-br-add-image"
                            style={{
                              fontSize: '20px',
                              marginBottom: -3,
                              color: '#9ca3af'
                            }}
                          />
                          <input
                            hidden
                            type="file"
                            onChange={e => handleChangeFile(e, 'logoURL')}
                          />
                        </FlexBox>
                      </Box>
                    )}

                    <Box>
                      <Paragraph>
                        Ícone{' '}
                        {fieldState.error && (
                          <Small color="error.main">
                            {fieldState.error.message}
                          </Small>
                        )}
                      </Paragraph>

                      <Box mt={1}>
                        <Tiny color="text.disabled">*.jpeg, *.jpg, *.png</Tiny>
                      </Box>
                      <Tiny color="text.disabled">512x512</Tiny>
                    </Box>
                  </FlexBox>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Link de Afiliado{' '}
                  <Span
                    fontWeight={500}
                    color="text.default"
                    sx={{
                      background: '#3950fe1f',
                      borderRadius: '17px',
                      padding: '0px 8px 2px',
                      ml: '3px'
                    }}
                  >
                    Importante
                  </Span>
                </Small>
              </Box>

              <TextField
                fullWidth
                sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                {...register('affiliateLink', {
                  setValueAs: value => value?.trim()
                })}
                defaultValue={project.settings.affiliateLink}
                error={!!errors.affiliateLink}
                helperText={errors.affiliateLink?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        component="i"
                        className="fi fi-rr-link-alt"
                        sx={{
                          color: theme => theme.palette.text.disabled,
                          fontSize: 16,
                          mt: 0.4
                        }}
                      />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Nome
                </Small>
              </Box>

              <TextField
                fullWidth
                sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                {...register('name', {
                  setValueAs: value => value?.trim()
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        component="i"
                        className="fi fi-rr-mobile-notch"
                        sx={{
                          color: theme => theme.palette.text.disabled,
                          fontSize: 16,
                          mt: 0.4
                        }}
                      />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Slug
                </Small>
              </Box>

              <TextField
                fullWidth
                placeholder={project.slug}
                sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                {...register('slug', {
                  setValueAs: value => value?.trim(),
                  onChange: handleSlugChange
                })}
                error={!!errors.slug}
                helperText={errors.slug?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Idioma
                </Small>
              </Box>

              <Select
                fullWidth
                defaultValue={project.settings.language}
                {...register('language')}
                sx={{ height: 45 }}
                error={!!errors.language}
              >
                <MenuItem value="pt-br">Português</MenuItem>
              </Select>

              <Small color="error.main">{errors.language?.message}</Small>
            </Grid>
          </Grid>

          <FlexBox justifyContent="end" mt={5}>
            <MuiButton
              loading={loading}
              variant="contained"
              fullWidth={downMd}
              type="submit"
              sx={{ height: 38 }}
              startIcon={
                <i
                  className="fi fi-rr-check-circle"
                  style={{ fontSize: '14px', marginTop: 3 }}
                />
              }
            >
              Atualizar
            </MuiButton>
          </FlexBox>
        </CardContent>
      </Card>
    </form>
  );
}
