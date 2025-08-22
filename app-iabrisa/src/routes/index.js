import React, { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

import LoadingScreen from 'components/loadingScreen';
import AppLayout from 'layouts/application';
import AuthLayout from 'layouts/authentication';
import NotFoundLayout from 'layouts/notFound';

import AuthGuard from './components/authGuard';
import GuestGuard from './components/guestGuard';

// ----------------------------------------------------------------------

export const Render = lazy(() => import('pages/render'));

// ----------------------------------------------------------------------

export const Loading = lazy(() => import('pages/loading'));
export const Login = lazy(() => import('pages/login'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Loading />
    },
    {
      path: ':id',
      element: <Loading />
    },
    {
      path: ':id/entrar',
      element: (
        <GuestGuard>
          <AuthLayout>
            <Login />
          </AuthLayout>
        </GuestGuard>
      )
    },
    {
      path: ':id',
      element: (
        <AuthGuard>
          <AppLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </AppLayout>
        </AuthGuard>
      ),
      children: [{ path: 'app', element: <Render /> }]
    },
    {
      path: '404',
      element: <NotFoundLayout />
    },
    {
      path: '*',
      element: <NotFoundLayout />
    }
  ]);
}
