import React, { createContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';

import LoadingScreen from 'components/loadingScreen';
import Api from 'config/api';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

const Types = Object.freeze({
  INIT: 'INIT',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
});

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const isExpiredToken = accessToken => {
  if (!accessToken) return true;
  const { exp } = jwtDecode(accessToken);
  return exp ? Date.now() / 1000 > exp : false;
};

const createSession = accessToken => {
  if (accessToken) {
    localStorage.setItem('app::accessToken', accessToken);
    Api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('app::accessToken');
    delete Api.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case Types.INIT:
      return {
        isInitialized: true,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated
      };
    case Types.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case Types.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: 'JWT',
  login: data => Promise.resolve(),
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async ({ email, password, id }) => {
    try {
      await Api.post('/users/login', { email, password, id }).then(
        async ({ data }) => {
          createSession(data.accessToken);
          delete data.accessToken;

          dispatch({
            type: Types.Login,
            payload: { user: data }
          });
        }
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Erro ao realizar login. Tente novamente.');
    }
  };

  const setUser = async user => {
    if (user) {
      dispatch({
        type: Types.INIT,
        payload: {
          user: {
            ...state.user,
            ...user
          },
          isAuthenticated: true
        }
      });
      return;
    }

    const accessToken = localStorage.getItem('app::accessToken');
    if (accessToken && !isExpiredToken(accessToken)) {
      createSession(accessToken);

      try {
        const { data } = await Api.get('/users/me');

        // Clean cache
        if (process.env.REACT_APP_VERSION !== data.version) {
          caches.keys().then(function (names) {
            for (const name of names) caches.delete(name);
          });
        }

        dispatch({
          type: Types.INIT,
          payload: { user: data, isAuthenticated: true }
        });
      } catch (error) {
        console.error(error);
        logout();
      }
    } else {
      dispatch({
        type: Types.INIT,
        payload: { user: null, isAuthenticated: false }
      });
    }
  };

  const logout = () => {
    createSession(null);
    dispatch({ type: Types.LOGOUT });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setUser();
      } catch (error) {
        console.error(error);
        dispatch({
          type: Types.INIT,
          payload: { user: null, isAuthenticated: false }
        });
      }
    };
    initializeAuth();
  }, []);

  if (!state.isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        setUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
