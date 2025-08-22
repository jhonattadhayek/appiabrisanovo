import React from 'react';

import InstallPwaDialog from 'components/pwaDialog';
import Router from 'routes';
import { InitialTheme } from 'theme/themeProvider';

export default function App() {
  return (
    <InitialTheme>
      <InstallPwaDialog />
      <Router />
    </InitialTheme>
  );
}
