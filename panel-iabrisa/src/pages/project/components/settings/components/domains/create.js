import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H3, Small } from 'components/typography';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';

export default function CreateDomain(props) {
  const { project, setProject, onClose } = props;

  const { setUser } = useAuth();

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    shouldFocusError: true,
    criteriaMode: 'all',
    reValidateMode: 'onChange'
  });

  const onSubmit = async form => {
    setLoading(true);

    try {
      const body = {
        url: form.url.replace(/https?:\/\//g, '').replace(/\//g, ''),
        token: project.token
      };

      const path = '/projects/domains/';
      const { data } = await Api.post(path + project.id, body);

      setProject(data.project);
      setUser({ project: data.project });

      toast.success('Domínio cadastrado com sucesso');
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
            <H3 fontWeight={600}>Adicionar novo domínio</H3>
            <Small color="text.disabled">
              Associe um novo domínio personalizado ao seu app.
            </Small>
          </Box>

          <IconButton onClick={onClose} sx={{ mt: -1.5, mr: -1 }}>
            <Close />
          </IconButton>
        </FlexBox>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Domínio"
                  type="text"
                  {...register('url', {
                    required: 'O domínio é obrigatório',
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-]*)?$/,
                      message: 'Informe um domínio válido'
                    }
                  })}
                  error={!!errors.url}
                  helperText={errors.url?.message}
                  sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Small color="text.disabled">https://</Small>
                      </InputAdornment>
                    )
                  }}
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
