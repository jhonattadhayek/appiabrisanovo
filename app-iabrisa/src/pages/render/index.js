import React, { useEffect, useState } from 'react';

import LoadingScreen from 'components/loadingScreen';
import useApp from 'hooks/useApp';
import ObApp from 'pages/project';

export default function Render() {
  const { app } = useApp();

  const [render, setRender] = useState(<LoadingScreen />);

  useEffect(() => {
    const options = {
      ob: <ObApp />
    };

    if (app) {
      setRender(options[app.type]);
    }
  }, [app]);

  return render;
}
