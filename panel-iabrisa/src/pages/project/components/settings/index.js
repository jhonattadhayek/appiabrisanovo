import React, { useEffect } from 'react';

import { Box } from '@mui/material';

import BasicInfo from './components/basicInfo';
import Domains from './components/domains';
import Scripts from './components/scripts';

export default function Settings({ project, setProject }) {
  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'scroll';
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box>
      <BasicInfo project={project} setProject={setProject} />

      <Box mt={3}>
        <Domains project={project} setProject={setProject} />
      </Box>

      <Box mt={3}>
        <Scripts project={project} setProject={setProject} />
      </Box>
    </Box>
  );
}
