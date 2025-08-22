import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, CardContent, useMediaQuery } from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';

import Banners from './components/banners';
import CreateBanner from './components/banners/create';
import More from './components/more';
import Premium from './components/premium';
import Theme from './components/theme';
import Webhook from './components/webhook';

import schema from './schema';

export default function Preferences({ project, setProject }) {
  const { setUser } = useAuth();

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const body = document.body;
    body.style.overflow = downMd ? 'scroll' : 'hidden';
  }, [downMd]);

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
    shouldFocusError: true,
    defaultValues: {
      ...project,
      plans: {
        free: {
          validation: project.plans.free.validation === 'buyed'
        }
      }
    }
  });

  const onSubmit = async form => {
    setLoading(true);

    try {
      form.pages.premium.description = form.pages.premium.description || '';

      const body = {
        theme: form.theme,
        token: project.token
      };

      body.pages = project.pages;

      body.pages.premium = form.pages.premium;
      body.pages.deposit = form.pages.deposit;

      body.plans = project.plans;
      body.plans.free.validation = form.plans.free.validation
        ? 'buyed'
        : 'anyone';

      const path = '/projects/update/';
      const { data } = await Api.patch(path + project.id, body);

      setProject(data.project);
      setUser({ project: data.project });

      toast.success('Aplicativo atualizado com sucesso');
    } catch (error) {
      toast.error(
        error.message || 'Algo inesperado aconteceu. Tente novamente'
      );
      console.error(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const onError = errors => {
    console.log(Object.keys(errors));
    console.log('errors', errors);
    toast.error('Erros no formulário.');
  };

  const openApp = () => {
    if (project.dns.domain) {
      return 'https://' + project.dns.domain;
    }

    return 'https://sinalmax.app/' + project.slug;
  };

  return (
    <Box>
      {openDialog && (
        <CreateBanner
          project={project}
          setProject={setProject}
          onClose={() => setOpenDialog(false)}
        />
      )}

      <FormProvider {...methods}>
        <form
          id="preferences-main-form"
          onSubmit={methods.handleSubmit(onSubmit, onError)}
        >
          <Box
            sx={{
              ...(!downMd && {
                pr: 1,
                height: 'calc(100vh - 250px)',
                overflowY: 'auto'
              })
            }}
          >
            <Card>
              <CardContent>
                <Theme project={project} />
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Banners
                  project={project}
                  setProject={setProject}
                  setOpenDialog={setOpenDialog}
                />
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <More project={project} setProject={setProject} />
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Premium />
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Webhook />
              </CardContent>
            </Card>
          </Box>

          <Box mb={4} />

          <FlexBox
            alignItems="center"
            gap={1}
            justifyContent={downMd ? 'center' : 'end'}
          >
            <MuiButton
              href={openApp()}
              target="_blank"
              variant="text"
              size="small"
              fullWidth={downMd}
              disableRipple
              sx={{
                color: '#354052',
                background: '#f3f4f6',
                '&:hover': {
                  background: '#f3f4f6'
                }
              }}
              endIcon={
                <i
                  className="fi fi-rr-up-right-from-square"
                  style={{ fontSize: '12px', marginBottom: -2 }}
                />
              }
            >
              Visualizar
            </MuiButton>

            <MuiButton
              size="small"
              variant="contained"
              type="submit"
              form="preferences-main-form"
              fullWidth={downMd}
              loading={loading}
              startIcon={
                <i
                  className="fi fi-rr-check-circle"
                  style={{ fontSize: '14px', marginBottom: -3 }}
                />
              }
            >
              Atualizar
            </MuiButton>
          </FlexBox>
        </form>
      </FormProvider>
    </Box>
  );
}
