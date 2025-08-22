import React from 'react';
import { toast } from 'react-toastify';

import { Close } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  styled,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import { H3, Paragraph, Span } from 'components/typography';
import ScrollBar from 'simplebar-react';

export default function ConfigureDomain(props) {
  const { onClose, domain } = props;

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));
  const host = domain.url.replace('https://', '');

  const handleClickClipboard = async value => {
    await navigator.clipboard.writeText(value);
    toast.success('Copiado para a área de transferência');
  };

  return (
    <Dialog
      fullWidth
      onClose={onClose}
      fullScreen={downMd}
      PaperProps={{ sx: { maxWidth: 560 } }}
      open
    >
      <DialogContent>
        <FlexBox alignItems="center" justifyContent="space-between">
          <Box>
            <H3 fontWeight={600}>Configurar domínio</H3>
          </Box>

          <IconButton onClick={onClose} sx={{ mt: -1.5, mr: -1 }}>
            <Close />
          </IconButton>
        </FlexBox>

        <Box mt={2}>
          <Paragraph color="text.disabled">
            Adicione os registros abaixo no seu provedor de DNS para confirmar
            que você é o proprietário de <Span fontWeight="bold">{host}</Span>
          </Paragraph>
        </Box>

        <Box mt={3} mb={1}>
          <DomainBox>
            <ScrollBar>
              <FlexBox>
                <DomainBoxItem type="header" width="100px" minWidth={60}>
                  Tipo de registro
                </DomainBoxItem>
                <DomainBoxItem type="header" width="200px" minWidth={100}>
                  Host
                </DomainBoxItem>
                <DomainBoxItem
                  type="header"
                  width="calc(100% - 300px)"
                  minWidth={200}
                >
                  Valor
                </DomainBoxItem>
              </FlexBox>

              <FlexBox>
                <DomainBoxItem width="100px" minWidth={60}>
                  A
                </DomainBoxItem>
                <DomainBoxItem width="200px" minWidth={100}>
                  {host}
                </DomainBoxItem>
                <DomainBoxItem width="calc(100% - 300px)" minWidth={200}>
                  <FlexBox alignItems="center">
                    199.36.158.100
                    <Tooltip title="Copiar valor" placement="top">
                      <IconButton
                        sx={{ ml: 0.5 }}
                        onClick={() => handleClickClipboard('199.36.158.100')}
                      >
                        <i
                          className="fi fi-rr-copy-alt"
                          style={{ fontSize: '14px', marginBottom: -2 }}
                        />
                      </IconButton>
                    </Tooltip>
                  </FlexBox>
                </DomainBoxItem>
              </FlexBox>

              <FlexBox width="100%">
                <DomainBoxItem
                  width="100px"
                  minWidth={60}
                  border="none !important"
                >
                  TXT
                </DomainBoxItem>
                <DomainBoxItem
                  width="200px"
                  minWidth={100}
                  border="none !important"
                >
                  {host}
                </DomainBoxItem>
                <DomainBoxItem
                  width="calc(100% - 300px)"
                  minWidth={200}
                  border="none !important"
                >
                  <FlexBox alignItems="center">
                    hosting-site=app-sinalmax
                    <Tooltip title="Copiar valor" placement="top">
                      <IconButton
                        onClick={() =>
                          handleClickClipboard('hosting-site=app-sinalmax')
                        }
                      >
                        <i
                          className="fi fi-rr-copy-alt"
                          style={{ fontSize: '14px', marginBottom: -2 }}
                        />
                      </IconButton>
                    </Tooltip>
                  </FlexBox>
                </DomainBoxItem>
              </FlexBox>
            </ScrollBar>
          </DomainBox>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const DomainBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8
}));

const DomainBoxItem = styled(FlexBox)(({ theme, width, type }) => ({
  alignItems: 'center',
  backgroundColor: type === 'header' ? '#f8f9fa' : 'inherit',
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: 12,
  fontWeight: type === 'header' ? 500 : 400,
  minHeight: 40,
  padding: 8,
  width
}));
