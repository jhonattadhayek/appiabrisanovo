import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
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

export default function CreateBanner(props) {
  const { project, setProject, onClose } = props;

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
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {}
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

  const onSubmit = async (form, e) => {
    setLoading(true);

    try {
      const regexHasHttps = /^https:\/\//i;
      const regexHasWww = /^www\./i;

      form.url = form.url.trim();

      if (regexHasWww.test(form.url) && !regexHasHttps.test(form.url)) {
        form.url = form.url.replace(/^www\./i, 'https://');
      } else if (!regexHasHttps.test(form.url)) {
        form.url = 'https://' + form.url;
      }

      form.url = form.url === 'https://' ? '' : form.url;

      const body = {
        url: form.url,
        image: form.image,
        token: project.token
      };

      const path = '/projects/banners/';
      const { data } = await Api.post(path + project.id, body);

      setProject(data.project);
      setUser({ project: data.project });

      toast.success('Banner cadastrado com sucesso');
      onClose();
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      fullWidth
      onClose={!loading && onClose}
      PaperProps={{ sx: { maxWidth: 560 } }}
      open
    >
      <DialogContent>
        <FlexBox alignItems="center" justifyContent="space-between">
          <Box>
            <H3 fontWeight={600}>Adicionar novo Banner</H3>
          </Box>

          <IconButton onClick={onClose} sx={{ mt: -1.5, mr: -1 }}>
            <Close />
          </IconButton>
        </FlexBox>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                            height={120}
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
                              height: 120,
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
                        <Tiny color="text.disabled">1179x789</Tiny>
                      </Box>
                    </FlexBox>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box mb={0.5}>
                  <Small fontWeight={500} color="text.disabled">
                    Ao clicar no banner
                  </Small>
                </Box>

                <TextField
                  fullWidth
                  placeholder="URL"
                  sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                  {...register('url', {
                    setValueAs: value => value?.trim()
                  })}
                  error={!!errors.url}
                  helperText={errors.url?.message}
                />
              </Grid>
            </Grid>
          </Box>

          <FlexBox justifyContent={downMd ? 'center' : 'end'} mt={4}>
            <MuiButton
              onClick={onClose}
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
              type="submit"
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
          </FlexBox>
        </form>
      </DialogContent>
    </Dialog>
  );
}
