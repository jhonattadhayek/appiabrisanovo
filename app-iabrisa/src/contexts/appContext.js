import React, { createContext, useEffect, useState } from 'react';

import Api from 'config/api';
import NotFoundLayout from 'layouts/notFound';

export const AppContext = createContext({
  app: undefined,
  setApp: arg => {}
});

export const AppProvider = ({ children }) => {
  const [app, setApp] = useState(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getData('token', '0a5b4a02-f0fe-4079-af1a-1a7a1a8b5b2b');

    async function getData(type, id) {
      let filter = `?filterKey=${type}&filterValue=${id}`;
      filter += '&filterKey=format&filterValue=app';

      await Api.get('/projects/users' + filter)
        .then(response => {
          if (response.data) {
            const app = response.data;

            window.document.title = app.name;

            const favicon = document.getElementById('favicon');
            if (favicon) favicon.href = app.settings.logoURL;

            const appIcon = document.getElementById('apple-touch-icon');
            if (appIcon) appIcon.href = app.settings.logoURL;

            const getType = url => {
              if (url.indexOf('png') > -1) return 'png';
              if (url.indexOf('jpg') > -1) return 'jpg';
              if (url.indexOf('jpeg') > -1) return 'jpeg';

              return 'png';
            };

            const manifestDetails = {
              short_name: app.name,
              name: app.name,
              icons: [
                {
                  src: app.settings.logoURL,
                  sizes: '64x64 32x32 24x24 16x16',
                  type: `image/${getType(app.settings.logoURL)}`
                },
                {
                  src: app.settings.logoURL,
                  type: `image/${getType(app.settings.logoURL)}`,
                  sizes: '192x192'
                },
                {
                  src: app.settings.logoURL,
                  type: `image/${getType(app.settings.logoURL)}`,
                  sizes: '512x512'
                }
              ],
              start_url: `${window.location.origin}/${app.slug}/app`,
              display: 'standalone',
              theme_color: '#070b0d',
              background_color: '#070b0d'
            };

            const stringManifest = JSON.stringify(manifestDetails);
            const blob = new Blob([stringManifest], {
              type: 'application/json'
            });

            const manifestURL = URL.createObjectURL(blob);
            const manifest = document.querySelector('#manifest-app');

            if (manifest) {
              manifest.setAttribute('href', manifestURL);
            }

            setApp(app);
          } else {
            setNotFound(true);
          }
        })
        .catch(() => {
          setNotFound(true);
        });
    }
  }, [location]);

  if (notFound) {
    return <NotFoundLayout />;
  }

  return (
    <AppContext.Provider value={{ app, setApp }}>
      {app && children}
    </AppContext.Provider>
  );
};
