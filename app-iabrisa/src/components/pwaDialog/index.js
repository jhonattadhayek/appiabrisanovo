import * as React from 'react';
import { useState, Fragment, useEffect } from 'react';

import { Close } from '@mui/icons-material';
import IosShareIcon from '@mui/icons-material/IosShare';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import {
  Button,
  IconButton,
  Card,
  Box,
  CardContent,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import { H3, Small } from 'components/typography';
import useApp from 'hooks/useApp';

export default function InstallPwaDialog() {
  const { app } = useApp();

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [open, setOpen] = useState(downMd);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const promptReady = e => {
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', promptReady);

    const getPWADisplayMode = () => {
      if (checkInstallTimestamp()) return;

      const isStandalone = window.matchMedia(
        '(display-mode: standalone)'
      ).matches;

      if (document.referrer.startsWith('android-app://')) {
        return 'pwa';
      }

      if (navigator.standalone || isStandalone) {
        return 'standalone';
      }

      return isChromeOrSafari();
    };

    getPWADisplayMode();
  }, [deferredPrompt]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleInstallAppClick = async () => {
    if (deferredPrompt !== null) {
      setShowInstallBanner(false);

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        localStorage.setItem('dialogInstall', 'installed');
        setDeferredPrompt(null);
      }
    }
  };

  const isChromeOrSafari = () => {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf('Chrome' || 'Chrome Android') !== -1) {
      return setShowInstallBanner('Chrome');
    }

    if (userAgent.indexOf('Safari') !== -1) {
      return setShowInstallBanner('Safari');
    }
  };

  const closeInstall = () => {
    localStorage.setItem('dialogInstall', Date.now());
    setOpen(false);
  };

  const checkInstallTimestamp = () => {
    const dialogInstallTimestamp = localStorage.getItem('dialogInstall');
    if (!dialogInstallTimestamp) return false;

    if (dialogInstallTimestamp === 'installed') return true;

    const twelveHoursInMillis = 12 * 60 * 60 * 1000;
    const currentTime = Date.now();
    const timeSinceDialogClosed =
      currentTime - parseInt(dialogInstallTimestamp);

    return timeSinceDialogClosed < twelveHoursInMillis;
  };

  return (
    <Fragment>
      {open && showInstallBanner && (
        <FlexBox justifyContent="center" sx={{ width: '100%' }}>
          <Box
            sx={{
              position: 'fixed',
              maxWidth: '450px',
              bottom: 0,
              zIndex: 9999
            }}
          >
            <Card
              autoFocus={false}
              onClose={handleClose}
              sx={{
                background: '#15191e',
                border: 'none !important',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)'
              }}
            >
              <CardContent>
                <FlexBox
                  sx={{ mb: 1 }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box width={34} />

                  <H3>{app?.name}</H3>

                  <IconButton onClick={closeInstall}>
                    <Close sx={{ fontSize: '18px', color: 'text.disabled' }} />
                  </IconButton>
                </FlexBox>

                <FlexBox
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                >
                  <Small color="text.disabled">
                    Acesse o aplicativo diretamente na tela inicial do seu
                    dipositivo e tenha uma experiência aprimorada.
                  </Small>
                </FlexBox>

                {showInstallBanner === 'Chrome' ? (
                  <FlexBox mt={2} mb={-1}>
                    <Button
                      id="installApp"
                      fullWidth
                      onClick={handleInstallAppClick}
                      size="small"
                      variant="contained"
                      sx={{
                        height: 38,
                        background: app?.theme?.primaryColor || '#3950FE',
                        '&:hover': {
                          background: app?.theme?.primaryColor || '#3950FE'
                        }
                      }}
                    >
                      INSTALAR
                    </Button>
                  </FlexBox>
                ) : (
                  <Box mt={2}>
                    <FlexBox alignItems="center">
                      <IosShareIcon
                        sx={{
                          fontSize: '18px',
                          mr: 1,
                          color: '#5887e6',
                          mt: '-3px'
                        }}
                      />
                      <Small>
                        <b>1)</b>
                        {`  `} Clique em {'"Compartilhar"'} na barra de
                        navegação
                      </Small>
                    </FlexBox>

                    <FlexBox mt={1.4} alignItems="center">
                      <LibraryAddIcon
                        sx={{
                          fontSize: '18px',
                          mr: 1,
                          color: '#5887e6',
                          mt: '-3px'
                        }}
                      />
                      <Small>
                        <b>2)</b> {` `}Clique em{' '}
                        {'"Adicionar à Tela de Início"'}
                      </Small>
                    </FlexBox>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </FlexBox>
      )}
    </Fragment>
  );
}
