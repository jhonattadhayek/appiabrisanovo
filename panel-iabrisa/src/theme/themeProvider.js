import React from 'react';
import { ToastContainer } from 'react-toastify';

import { CssBaseline, ThemeProvider } from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';
import './styles/swall.css';
import './styles/scroll.css';
import './styles/quill.css';
import './styles/dots.css';

import useTheme from './createTheme';

// ----------------------------------------------------------------------

export function InitialTheme({ children }) {
  const theme = useTheme();

  const toastConfig = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: 'light'
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer {...toastConfig} />
      {children}
    </ThemeProvider>
  );
}
