import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip
} from '@mui/material';
import FlexBox from 'components/flexBox';
import { H4, Paragraph } from 'components/typography';

export default function Webhook() {
  const [plataform, setPlataform] = useState('kirvano');

  const { getValues } = useFormContext();

  const handleClickClipboard = async (key, value) => {
    if (value) {
      await navigator.clipboard.writeText(value);
      toast.success(key + ' copiado com sucesso');
    }
  };

  const projectId = getValues('id');
  const webhookURL = `https://us-central1-sinalmax.cloudfunctions.net/api/webhook/${plataform}/${projectId}`;

  return (
    <Box>
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
            className="fi fi-br-webhook"
            style={{ fontSize: '14px', marginBottom: -3 }}
          />
        </FlexBox>

        <Box lineHeight={1} mt={-0.5}>
          <H4>Webhook</H4>
          <Paragraph fontSize="12px" color="text.disabled">
            Adicione nossa URL no seu produto.
          </Paragraph>
        </Box>
      </FlexBox>

      <Box mt={3}>
        <FlexBox alignItems="center" gap={1} mb={1.5}>
          <Chip
            size="small"
            label="Kirvano"
            onClick={() => setPlataform('kirvano')}
            sx={{
              color: plataform === 'kirvano' ? '#5742b9' : '#232833',
              background: plataform === 'kirvano' ? '#5842bc24' : '#f3f4f6'
            }}
          />

          <Chip
            size="small"
            label="Perfect Pay"
            onClick={() => setPlataform('perfect')}
            sx={{
              color: plataform === 'perfect' ? '#5742b9' : '#232833',
              background: plataform === 'perfect' ? '#5842bc24' : '#f3f4f6'
            }}
          />

          <Chip
            size="small"
            label="Lastlink"
            onClick={() => setPlataform('lastlink')}
            sx={{
              color: plataform === 'lastlink' ? '#5742b9' : '#232833',
              background: plataform === 'lastlink' ? '#5842bc24' : '#f3f4f6'
            }}
          />
        </FlexBox>

        <Box>
          <TextField
            disabled
            fullWidth
            value={webhookURL}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i
                    className="fi fi-br-webhook"
                    style={{ marginBottom: -3 }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copiar">
                    <IconButton
                      sx={{ p: 0 }}
                      onClick={() => handleClickClipboard('URL', webhookURL)}
                    >
                      <i
                        className="fi fi-rr-copy-alt"
                        style={{ fontSize: '16px' }}
                      />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
