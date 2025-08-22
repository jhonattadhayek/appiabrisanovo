import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppProvider } from 'contexts/appContext';
import { AuthProvider } from 'contexts/authContext';

import App from './app';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'simplebar/dist/simplebar.min.css';
import '@flaticon/flaticon-uicons/css/all/all.css';

const Providers = ({ children }) => (
  <AppProvider>
    <AuthProvider>{children}</AuthProvider>
  </AppProvider>
);

const rootElement = document.getElementById('root');

const router = createBrowserRouter([{ path: '*', element: <App /> }]);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
} else {
  console.error('Failed to find the root element.');
}

serviceWorkerRegistration.register();
