import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingScreen from 'components/loadingScreen';
import useApp from 'hooks/useApp';

export default function Loading() {
  const { app } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (app) {
      navigate(`/${app.slug}/app?tab=inicio`);
    }
  }, [app]);

  return (
    <Fragment>
      <LoadingScreen />
    </Fragment>
  );
}
