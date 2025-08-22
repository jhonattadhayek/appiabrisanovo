import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

import { useTheme } from '@emotion/react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  styled,
  useMediaQuery
} from '@mui/material';
import FlexBox from 'components/flexBox';
import { Small } from 'components/typography';
import Api from 'config/api';

export default function UsersChart({ project }) {
  const theme = useTheme();

  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(true);
  const [formattedData, setFormattedData] = useState({
    categories: [],
    data: []
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('usersListCharts'));

    if (storedData) {
      if (
        storedData.projectId === project.id &&
        new Date() - new Date(storedData.timestamp) <= 1800000
      ) {
        setFormattedData(storedData.data);
        setLoading(false);
      } else {
        getNumUsers();
      }
    } else {
      getNumUsers();
    }
  }, []);

  const getNumUsers = async () => {
    try {
      const { data } = await Api.get(`/reports/users-by-day/${project.token}`);

      const seriesData = [];
      const categoriesData = [];

      data.forEach(data => {
        seriesData.push(data.value);
        categoriesData.push(data.label);
      });

      const state = {
        data: seriesData,
        categories: categoriesData
      };

      setFormattedData(state);

      localStorage.setItem(
        'usersListCharts',
        JSON.stringify({
          data: state,
          projectId: project.id,
          timestamp: new Date().getTime()
        })
      );
    } catch (error) {
      console.error(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return !loading ? (
    <CustomCard sx={{ minHeight: '420px' }}>
      <CardContent>
        <FlexBox
          display={downMd ? 'block' : 'flex'}
          justifyContent="space-between"
        >
          <Small fontSize="14px" fontWeight={500} color="text.disabled">
            Novos usuários nos últimos 10 dias
          </Small>
        </FlexBox>

        <Box mt={4}>
          <CustomBox>
            <Chart
              options={{
                chart: {
                  background: 'transparent',
                  toolbar: {
                    show: false
                  }
                },

                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 90, 100]
                  }
                },
                colors: ['#5742b9'],
                dataLabels: {
                  enabled: false
                },
                grid: {
                  show: true,
                  color: 'text.disabled'
                },

                xaxis: {
                  categories: formattedData.categories || [],
                  labels: {
                    style: {
                      colors: theme.palette.text.disabled,
                      fontFamily: theme.typography.fontFamily,
                      fontWeight: 500
                    }
                  }
                },
                yaxis: {
                  show: true
                },

                tooltip: {
                  x: {
                    show: false
                  },
                  y: {}
                },
                responsive: [
                  {
                    breakpoint: 550,
                    options: {
                      chart: {
                        height: 350
                      },
                      plotOptions: {
                        bar: {
                          horizontal: true
                        }
                      },
                      xaxis: {
                        labels: {
                          show: true
                        }
                      },
                      yaxis: {
                        show: true,
                        labels: {
                          style: {
                            colors: theme.palette.text.disabled,
                            fontFamily: theme.typography.fontFamily,
                            fontWeight: 500
                          }
                        }
                      }
                    }
                  }
                ]
              }}
              series={[
                {
                  name: 'Total',
                  data: formattedData.data
                }
              ]}
              type="area"
              height={280}
            />
          </CustomBox>
        </Box>
      </CardContent>
    </CustomCard>
  ) : (
    <Card sx={{ height: 388 }}>
      <CardHeader
        title={<Skeleton variant="text" width="20%" animation="wave" />}
      />
      <CardContent>
        <Skeleton variant="text" width="50%" animation="wave" />
        <Skeleton variant="text" width="45%" animation="wave" />
      </CardContent>
    </Card>
  );
}

const CustomCard = styled(Card)(() => ({
  background: '#fff',
  boxShadow: '0px 3.5px 5.5px rgba(0, 0, 0, 0.02)',
  borderRadius: '15px',
  borderColor: 'transparent'
}));

const CustomBox = styled(Box)(({ theme }) => ({
  marginTop: 2,
  '& .apexcharts-tooltip *': {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500
  },
  '& .apexcharts-tooltip': {
    boxShadow: 0,
    borderRadius: 4,
    alignItems: 'center',
    '& .apexcharts-tooltip-text-y-value': {
      color: 'primary.main'
    },
    '& .apexcharts-tooltip.apexcharts-theme-light': {
      border: `1px solid ${theme.palette.divider}`
    },
    '& .apexcharts-tooltip-series-group:last-child': {
      paddingBottom: 0
    }
  }
}));
