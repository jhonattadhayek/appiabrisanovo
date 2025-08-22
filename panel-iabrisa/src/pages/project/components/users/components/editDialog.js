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
  MenuItem,
  Select,
  TextField,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import { H3, Small, Span } from 'components/typography';
import Api from 'config/api';

export default function EditDialog(props) {
  const { project, user, users, setUsers, onClose } = props;

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    shouldFocusError: true,
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      ...user
    }
  });

  const onSubmit = async form => {
    setLoading(true);

    try {
      const body = {
        actived: form.actived,
        signature: form.signature,
        token: project.token,
        id: form.id
      };

      const path = '/users/update/';
      await Api.patch(path, body);

      const newUsersList = replaceUserById(users.list, user.id, { ...form });
      setUsers({ ...users, list: newUsersList });

      toast.success('Usuário atualizado com sucesso');
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const replaceUserById = (users, userId, newItem) => {
    const index = users.findIndex(obj => obj.id === userId);

    if (index !== -1) {
      const { ...form } = newItem;
      users[index] = { ...users[index], ...form };
    }

    return users;
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
            <H3 fontWeight={600}>Editar usuário</H3>
            <Span color="text.disabled" fontSize="14px">
              Edite abaixo os dados do usuário.
            </Span>
          </Box>

          <IconButton onClick={onClose} sx={{ mt: -1.5, mr: -1 }}>
            <Close />
          </IconButton>
        </FlexBox>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box mt={3} sx={{ minHeight: 220 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box mb={0.5}>
                  <Small fontWeight={500} color="text.disabled">
                    {user?.email ? 'E-mail' : 'Telefone'}
                  </Small>
                </Box>

                <TextField
                  fullWidth
                  disabled
                  value={user?.email || user?.phone}
                  sx={{ '& > .MuiInputBase-root': { height: 45 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box mb={0.5}>
                  <Small fontWeight={500} color="text.disabled">
                    Status
                  </Small>
                </Box>

                <Controller
                  name="actived"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      defaultValue={user.actived}
                      {...register('actived')}
                      sx={{ height: 45 }}
                      error={!!errors.actived}
                    >
                      <MenuItem value={true}>Ativo</MenuItem>
                      <MenuItem value={false}>Inativo</MenuItem>
                    </Select>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box mb={0.5}>
                  <Small fontWeight={500} color="text.disabled">
                    Plano
                  </Small>
                </Box>

                <Controller
                  name="signature"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      defaultValue={user.signature}
                      {...register('signature')}
                      sx={{ height: 45 }}
                      error={!!errors.signature}
                    >
                      <MenuItem value="free">
                        {project?.plans?.free?.name}
                      </MenuItem>
                      <MenuItem value="paid">
                        {project?.plans?.paid?.name}
                      </MenuItem>
                    </Select>
                  )}
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
                  style={{ fontSize: '14px', marginBottom: -3 }}
                />
              }
            >
              Atualizar
            </MuiButton>
          </FlexBox>
        </form>
      </DialogContent>
    </Dialog>
  );
}
