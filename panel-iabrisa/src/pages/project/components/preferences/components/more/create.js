import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  TextField,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H3, Paragraph, Small, Tiny } from 'components/typography';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';
import { convertImage } from 'utils/image';
import * as yup from 'yup';

const schema = yup.object().shape({
  URL: yup
    .string()
    .url('Digite uma URL válida')
    .required('A URL é obrigatória'),
  cta: yup.string().required('O texto do botão é obrigatório'),
  title: yup.string().required('O título é obrigatório'),
  image: yup.string()
});

export default function CreateMenuComponent(props) {
  const { handleCloseDialog, project, setProject } = props;

  const { setUser } = useAuth();
  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors }
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(schema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      image: '',
      cta: '',
      URL: ''
    }
  });

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

  const onSubmit = async form => {
    setLoading(true);

    try {
      const dataToPost = { ...form, token: project.token };

      const { data } = await Api.post(
        `/projects/menu/${project.id}`,
        dataToPost
      );

      setProject(data.project);
      setUser({ project: data.project });

      toast.success('Navegação criada com sucesso');
      handleCloseDialog();
    } catch (error) {
      toast.error(
        error?.message || 'Algo inesperado aconteceu. Tente novamente'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    handleSubmit(onSubmit)();
  };

  const handleClose = () => {
    if (!loading) {
      handleCloseDialog();
    }
  };

  return (
    <Dialog fullWidth fullScreen={downMd} onClose={handleClose} open>
      <DialogContent>
        <form noValidate style={{ height: '100%' }}>
          <FlexBox alignItems="center" justifyContent="space-between">
            <Box>
              <H3 fontWeight={600}>Nova navegação</H3>
            </Box>

            <IconButton onClick={handleClose} sx={{ p: 0 }}>
              <Close />
            </IconButton>
          </FlexBox>

          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="image"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FlexBox gap={2} mb={2}>
                      {field.value ? (
                        <Box component="label">
                          <Box
                            component="img"
                            width={180}
                            height={100}
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
                            onChange={e => handleChangeFile(e, 'image')}
                          />
                        </Box>
                      ) : (
                        <Box component="label">
                          <FlexBox
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                              background: '#f3f4f6',
                              width: 180,
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
                              onChange={e => handleChangeFile(e, 'image')}
                            />
                          </FlexBox>
                        </Box>
                      )}

                      <Box>
                        <Paragraph>
                          Imagem{' '}
                          {fieldState.error && (
                            <Small color="error.main">
                              {fieldState.error.message}
                            </Small>
                          )}
                        </Paragraph>

                        <Box mt={1}>
                          <Tiny color="text.disabled">
                            *.jpeg, *.jpg, *.png
                          </Tiny>
                        </Box>
                        <Tiny color="text.disabled">720x324</Tiny>
                      </Box>
                    </FlexBox>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box mb={0.5}>
                  <Small fontWeight={500} color="text.disabled">
                    Título
                  </Small>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Digite um título"
                  sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                  {...register('title')}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <Box mb={0.5}>
                  <Small fontWeight={500} color="text.disabled">
                    Descrição
                  </Small>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Digite uma descrição curta"
                  {...register('description')}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <Box mb={0.5}>
                  <Small fontWeight={500} color="text.disabled">
                    CTA
                  </Small>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Texto do botão"
                  sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                  {...register('cta')}
                  error={!!errors.cta}
                  helperText={errors.cta?.message}
                />
              </Grid>

              <Grid item xs={12} md={7}>
                <Box mb={0.5}>
                  <Small fontWeight={500} color="text.disabled">
                    URL
                  </Small>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Digite uma URL"
                  sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                  {...register('URL')}
                  error={!!errors.URL}
                  helperText={errors.URL?.message}
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </DialogContent>

      <DialogActions sx={{ padding: 2 }}>
        <MuiButton
          onClick={handleClose}
          fullWidth={downMd}
          disabled={loading}
          disableFocusRipple
          disableRipple
          sx={{
            mr: 1,
            height: 38,
            color: '#354052',
            background: '#f3f4f6',
            '&:hover': {
              background: '#f3f4f6'
            }
          }}
        >
          Cancelar
        </MuiButton>

        <MuiButton
          onClick={handleClick}
          variant="contained"
          fullWidth={downMd}
          loading={loading}
          sx={{ height: 38 }}
          startIcon={
            <i
              className="fi fi-rr-check-circle"
              style={{ fontSize: '14px', marginTop: 3 }}
            />
          }
        >
          Cadastrar
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
}
