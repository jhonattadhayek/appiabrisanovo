import React, { useState, useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';

import { Box } from '@mui/material';

import Account from './components/account';
import Home from './components/home';
import Legal from './components/legal';
import More from './components/more';
import Notices from './components/notices';
import Premium from './components/premium';
import Signals from './components/signals';
import Tutorials from './components/tutorials';

export default function ObApp() {
  const { search } = useLocation();

  const [selected, setSelected] = useState('inicio');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const getQueryValue = key => {
      const params = new URLSearchParams(search);
      return params.get(key) || 'inicio';
    };

    setSelected(getQueryValue('tab'));
  }, [search]);

  const content = {
    inicio: <Home />,
    'minha-conta': <Account />,
    noticias: <Notices />,
    sinais: <Signals />,
    mais: <More />,
    premium: <Premium />,
    legal: <Legal />,
    aulas: <Tutorials />
  };

  return <Box>{content[selected] || <Fragment />}</Box>;
}
