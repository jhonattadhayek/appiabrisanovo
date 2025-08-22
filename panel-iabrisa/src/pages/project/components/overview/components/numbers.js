import React, { useEffect, useState } from 'react';

import { Box, Card, CardContent, Grid } from '@mui/material';
import DotsProgress from 'components/dots';
import FlexBox from 'components/flexBox';
import { H5, Small } from 'components/typography';
import Api from 'config/api';
import { numberCompact } from 'utils/formatter';

export default function Numbers({ project }) {
  const [numUsers, setNumUsers] = useState({
    total: project.numUsers,
    premium: null
  });

  const listCards = [
    { title: 'Engajamento', value: '...', icon: 'fi fi-sr-display-chart-up' },
    {
      title: 'Usuários',
      value: numberCompact(numUsers.total),
      icon: 'fi fi-sr-users'
    },
    {
      title: 'Premium',
      value:
        numUsers.premium !== null ? (
          numberCompact(numUsers.premium)
        ) : (
          <DotsProgress fontSize="4px" />
        ),
      icon: 'fi fi-sr-crown'
    }
  ];

  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'scroll';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getNumUsers();
  }, []);

  const getNumUsers = async () => {
    try {
      const { data } = await Api.get(
        `/reports/num-users/${project.token}?filterKey=signature&filterValue=paid`
      );

      setNumUsers({ ...numUsers, premium: data.value });
    } catch (error) {
      console.error(error.message || error);
    }
  };

  return (
    <Grid container spacing={3}>
      {listCards.map((item, index) => {
        return (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <FlexBox justifyContent="space-between">
                  <Box>
                    <Small color="text.disabled">{item.title}</Small>
                    <H5>{item.value}</H5>
                  </Box>

                  <FlexBox justifyContent="center" alignItems="center">
                    <FlexBox
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        width: 35,
                        height: 35,
                        background: '#5842bc24',
                        color: '#5742b9',
                        borderRadius: '4px'
                      }}
                    >
                      <i className={item.icon} style={{ marginBottom: -3 }} />
                    </FlexBox>
                  </FlexBox>
                </FlexBox>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
