import React from 'react';

import Router from 'routes';
import { InitialTheme } from 'theme/themeProvider';

export default function App() {
  return (
    <InitialTheme>
      <Router />
    </InitialTheme>
  );
}
