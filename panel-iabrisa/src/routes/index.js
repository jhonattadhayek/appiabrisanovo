import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import LoadingScreen from 'components/loadingScreen';
import AuthLayout from 'layouts/authentication';
import DashboardLayout from 'layouts/dashboard';
import NotFound from 'layouts/notFound';

import AuthGuard from './components/authGuard';
import GuestGuard from './components/guestGuard';

// ----------------------------------------------------------------------

export const SignIn = lazy(() => import('pages/auth/signIn'));
export const Confirm = lazy(() => import('pages/auth/confirm'));

export const Redirect = lazy(() => import('pages/redirect'));
export const Home = lazy(() => import('pages/home'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard" />
    },
    {
      path: '',
      element: (
        <GuestGuard>
          <AuthLayout />
        </GuestGuard>
      ),
      children: [
        { path: 'login', element: <SignIn /> },
        { path: 'confirm', element: <Confirm /> }
      ]
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
      children: [{ path: 'dashboard', element: <Home /> }]
    },
    {
      path: 'redirect',
      element: <Redirect />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]);
}
