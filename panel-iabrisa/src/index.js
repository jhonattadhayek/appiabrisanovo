import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from 'contexts/authContext';

import App from './app';

import 'simplebar/dist/simplebar.min.css';
import '@flaticon/flaticon-uicons/css/all/all.css';
import 'react-quill/dist/quill.snow.css';

const Providers = ({ children }) => <AuthProvider>{children}</AuthProvider>;

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
