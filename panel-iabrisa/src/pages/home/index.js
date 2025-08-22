import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Box, CircularProgress } from '@mui/material';
import Api from 'config/api';
import useAuth from 'hooks/useAuth';
import Project from 'pages/project';

export default function Home() {
  const { user, setUser } = useAuth();

  const [render, setRender] = useState(
    <Box textAlign="center" pt={6} minHeight="100%">
      <CircularProgress aria-label="Loading" />
    </Box>
  );

  useEffect(() => {
    const getData = async () => {
      const { data } = await Api.get('/projects/id/eQa4Iky8JbHLJtIh1Z15').catch(
        error => toast.error(error.message)
      );

      user.project = data;

      setUser(user);
      setRender(<Project />);
    };

    if (user) {
      getData();
    }
  }, []);

  return render;
}
