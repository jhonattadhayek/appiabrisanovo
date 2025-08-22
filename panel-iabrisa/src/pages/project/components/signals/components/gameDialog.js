import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { Close } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  Select,
  TextField,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import MuiButton from 'components/mui/button';
import FormInputSlider from 'components/mui/slider';
import MuiSwitch from 'components/mui/switch';
import { H3, H5, Paragraph, Small, Span } from 'components/typography';
import Api from 'config/api';
import { CURRENCY_PAIRS_VALUES, EXPIRATION_TIMES } from 'constants/coins';
import useAuth from 'hooks/useAuth';
import * as yup from 'yup';

export default function GameDialog(props) {
  const { onClose, data, project, setProject } = props;

  const { setUser } = useAuth();
  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);

  const signalSchema = yup.object().shape({
    actived: yup.boolean().required(),
    gale: yup.number().oneOf([0, 1, 2]).required('Campo obrigatório'),
    type: yup.string().oneOf(['generated', 'automatic']),
    name: yup.string().required('O nome é obrigatório'),
    expirationTime: yup.number().required('O tempo de expiração é obrigatório'),
    assertiveness: yup.number().required('Campo obrigatório'),
    rule: yup.string().oneOf(['default', 'personalized']).required()
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    shouldFocusError: true,
    resolver: yupResolver(signalSchema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      actived: data.actived,
      gale: data.gale || 0,
      showIframe: true,
      assertiveness: data.assertiveness || 0,
      expirationTime: data.expirationTime || 15,
      name: data.name,
      rule: 'default',
      premium: data.premium,
      type: data.type,
      sequence: data.sequence,
      pattern: data.pattern,
      image: data.image
    }
  });

  const type = watch('type');
  const assertiveness = watch('assertiveness');

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const onSubmit = async form => {
    setLoading(true);

    try {
      const currencyPairs = [];
      const chipPairs = document.getElementsByName('chip-pairs');

      chipPairs.forEach(element => {
        if (element.innerText) {
          const tagText = element.innerText.trim();
          const currencyPair = CURRENCY_PAIRS_VALUES.find(
            c => c.label === tagText
          );

          if (currencyPair) {
            currencyPairs.push(currencyPair);
          }
        }
      });

      form.currencyPairs = currencyPairs;

      switch (form.pattern) {
        case 'both':
          form.image =
            'https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalDefault_short.png?alt=media&token=397f5335-93ee-4024-a37f-6c4c80b2406d';
          break;

        case 'put':
          form.image =
            'https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalBear_short.png?alt=media&token=a82f263c-4fe7-4e03-86c3-9a59beda314d';
          break;

        case 'call':
          form.image =
            'https://firebasestorage.googleapis.com/v0/b/sinalmax.firebasestorage.app/o/ob%2FsignalBull_short.png?alt=media&token=c3f52693-dc51-4a91-af4f-34168e1a18d3';
          break;

        default:
          form.image = null;

          break;
      }

      const body = {
        token: project.token,
        games: {
          ...project.games,
          [data.id]: form
        }
      };

      const { data: apiData } = await Api.patch(
        `/projects/update/${project.id}`,
        body
      );

      setProject(apiData.project);
      setUser({ project: apiData.project });

      toast.success('Dados atualizados com sucesso');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || 'Algo inesperado aconteceu. Tente novamente.'
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <Dialog
      fullWidth
      onClose={handleClose}
      fullScreen={downMd}
      PaperProps={{ sx: { maxHeight: downMd ? '100vh' : 600 } }}
      open
    >
      <DialogTitle>
        <FlexBox justifyContent="space-between" alignItems="center">
          <Box>
            <H3 fontWeight={600}>Editar Padrão</H3>
          </Box>

          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </FlexBox>
      </DialogTitle>

      <DialogContent>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Nome
                </Small>
              </Box>

              <TextField
                fullWidth
                placeholder="Ex: Padrão Duplo"
                type="text"
                {...register('name', {
                  setValueAs: value => value?.trim()
                })}
                error={!!errors.URL}
                helperText={errors.URL?.message}
                sx={{ '& > .MuiInputBase-root': { height: 45 } }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Direção
                </Small>
              </Box>

              <Controller
                name="pattern"
                control={control}
                render={({ field, onChange }) => (
                  <Select
                    displayEmpty
                    fullWidth
                    sx={{
                      height: 45,
                      '.MuiInputBase-root': { height: '100%' }
                    }}
                    onChange={onChange}
                    {...field}
                  >
                    <MenuItem value="both">Ambos</MenuItem>
                    <MenuItem value="put">Venda</MenuItem>
                    <MenuItem value="call">Compra</MenuItem>
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={6} md={4}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Status
                </Small>
              </Box>

              <Controller
                name="actived"
                control={control}
                render={({ field, onChange }) => (
                  <Select
                    displayEmpty
                    fullWidth
                    sx={{
                      height: 45,
                      '.MuiInputBase-root': { height: '100%' }
                    }}
                    onChange={onChange}
                    {...field}
                  >
                    <MenuItem value={true}>Ativo</MenuItem>
                    <MenuItem value={false}>Inativo</MenuItem>
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={6} md={4}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Expiração
                </Small>
              </Box>

              <Controller
                name="expirationTime"
                control={control}
                render={({ field, onChange }) => (
                  <Select
                    displayEmpty
                    fullWidth
                    sx={{
                      height: 45,
                      '.MuiInputBase-root': { height: '100%' }
                    }}
                    onChange={onChange}
                    {...field}
                  >
                    {EXPIRATION_TIMES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={6} md={4}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Martingales
                </Small>
              </Box>

              <Controller
                name="gale"
                control={control}
                render={({ field, onChange }) => (
                  <Select
                    displayEmpty
                    fullWidth
                    sx={{
                      height: 45,
                      '.MuiInputBase-root': { height: '100%' }
                    }}
                    onChange={onChange}
                    {...field}
                  >
                    {[0, 1, 2].map(value => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Indentificador do sinal
                </Small>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card
                    onClick={() => {
                      setValue('type', 'generated');
                    }}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      border: '1px solid #c4c4c4 !important'
                    }}
                  >
                    <CardHeader
                      sx={{ p: 0 }}
                      avatar={
                        <Radio
                          checked={type === 'generated'}
                          value="generated"
                          sx={{ mr: '-16px !important' }}
                        />
                      }
                      title={<H5>Manual</H5>}
                    />
                    <CardContent sx={{ p: '0px 14px 6px' }}>
                      <Paragraph color="text.disabled">
                        O usuário clica no botão pra indentificar o melhor sinal
                        naquele momento.
                      </Paragraph>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    onClick={() => {
                      setValue('type', 'automatic');
                    }}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      border: '1px solid #c4c4c4 !important'
                    }}
                  >
                    <CardHeader
                      sx={{ p: 0 }}
                      avatar={
                        <Radio
                          checked={type === 'automatic'}
                          value="automatic"
                          sx={{ mr: '-16px !important' }}
                        />
                      }
                      title={<H5>Automático</H5>}
                    />
                    <CardContent sx={{ p: '0px 14px 6px' }}>
                      <Paragraph color="text.disabled">
                        O sistema procura por sinais automaticamente. Leva de 2
                        à 3 minutos por sinal.
                      </Paragraph>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box mb={0.5}>
                <Small fontWeight={500} color="text.disabled">
                  Moedas
                </Small>
              </Box>

              <Autocomplete
                multiple
                freeSolo
                id="coins-autocomplete"
                options={CURRENCY_PAIRS_VALUES.sort((a, b) =>
                  a.label.localeCompare(b.label)
                ).map(item => item.label)}
                getOptionLabel={option => option}
                defaultValue={data.currencyPairs?.map(item => item.label) || []}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });

                    return (
                      <Chip
                        name="chip-pairs"
                        key={index}
                        variant="contained"
                        size="small"
                        sx={{ borderRadius: '60px' }}
                        label={option}
                        {...tagProps}
                      />
                    );
                  })
                }
                renderInput={params => <TextField {...params} />}
              />
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ px: 2, mb: -1.5 }}>
                  <Box mb={0.5}>
                    <Small fontWeight={500} color="text.disabled">
                      Assertividade ({assertiveness}%)
                    </Small>
                  </Box>

                  <FormInputSlider
                    name="assertiveness"
                    control={control}
                    setValue={setValue}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box mb={0.5} mt={1}>
                <Paragraph fontWeight={600}>Padrão Premium</Paragraph>
                <Small fontWeight={500} color="text.disabled">
                  Somente para assinantes premium.
                </Small>
              </Box>

              <Controller
                name="premium"
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
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <MuiButton
          onClick={onClose}
          fullWidth={downMd}
          disabled={loading}
          disableFocusRipple
          disableRipple
          sx={{
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
          onClick={handleSubmit(onSubmit)}
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
          Atualizar
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
}
