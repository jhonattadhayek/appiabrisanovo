import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import LoadingScreen from 'components/loadingScreen';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';

export default function Redirect() {
  const { setUser } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const createSession = accessToken => {
      if (accessToken) {
        localStorage.setItem('trader::accessToken', accessToken);
        Api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      } else {
        localStorage.removeItem('trader::accessToken');
        delete Api.defaults.headers.common.Authorization;
      }
    };

    const login = async () => {
      const accessToken = location.search.split('?token=')[1];

      if (accessToken) {
        createSession(accessToken);

        await setUser();
        return navigate('/dashboard');
      }

      return navigate('/404');
    };

    login();
  }, []);

  return <LoadingScreen />;
}
