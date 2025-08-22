import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H3, Small, Span } from 'components/typography';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';

export default function Scripts({ project, setProject }) {
  const { setUser } = useAuth();

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm({
    shouldFocusError: true,
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      scripts: project?.settings?.scripts,
      scripts2: project?.settings?.scripts2
    }
  });

  useEffect(() => {
    reset({
      scripts: project?.settings?.scripts,
      scripts2: project?.settings?.scripts2
    });
  }, [project, reset]);

  const handleFormSubmit = async form => {
    setLoading(true);

    try {
      const { settings } = project;

      const body = {
        settings: {
          affiliateLink: settings.affiliateLink,
          language: settings.language,
          logoURL: settings.logoURL,
          scripts: form.scripts,
          scripts2: form.scripts2
        },
        token: project.token
      };

      const path = '/projects/update/';
      const { data } = await Api.patch(path + project.id, body);

      setProject(data.project);
      setUser({ project: data.project });

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
              Scripts
            </H3>
          }
          subheader={
            <Span color="text.disabled" fontSize="14px">
              Adicione seus scripts personalizados.
            </Span>
          }
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mt: -2 }}>
            <Grid item xs={12} md={6}>
              <Box mb={1}>
                <Small color="text.disabled">HEAD</Small>
              </Box>

              <TextField
                fullWidth
                {...register('scripts')}
                name="scripts"
                error={!!errors.scripts}
                helperText={errors.scripts?.message}
                multiline
                rows={6}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mb={1}>
                <Small color="text.disabled">BODY</Small>
              </Box>

              <TextField
                fullWidth
                {...register('scripts2')}
                name="scripts2"
                error={!!errors.scripts2}
                helperText={errors.scripts2?.message}
                multiline
                rows={6}
              />
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
