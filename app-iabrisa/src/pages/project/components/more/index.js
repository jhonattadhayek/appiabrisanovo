import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Box, Card, CardContent } from '@mui/material';
import Header from 'components/header';
import MuiButton from 'components/mui/button';
import { H4, Paragraph } from 'components/typography';
import useApp from 'hooks/useApp';

export default function More() {
  const { app } = useApp();

  const options = app?.pages?.more || [];

  return (
    <Fragment>
      <Header title="Mais" />

      <Box mt={2}>
        {options.map((elem, index) => {
          return (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                {elem.image && (
                  <Box
                    sx={{
                      background: `url(${elem.image})`,
                      height: 160,
                      width: '100%',
                      backgroundSize: 'cover'
                    }}
                  />
                )}

                <Box mt={elem.image ? 1.5 : 0}>
                  {elem.title && <H4 fontSize="18px">{elem.title}</H4>}

                  {elem.description && (
                    <Paragraph color="text.disabled">
                      {elem.description}
                    </Paragraph>
                  )}
                </Box>

                <MuiButton
                  variant="contained"
                  href={elem.URL}
                  target="_blank"
                  sx={{
                    mt: 1.5,
                    height: 38,
                    background: app?.theme?.primaryColor,
                    '&:hover': {
                      background: app?.theme?.primaryColor
                    }
                  }}
                >
                  {elem.cta}
                </MuiButton>
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardContent>
            <Box>
              <H4 fontSize="18px">Aviso Legal</H4>

              <Paragraph color="text.disabled">
                Saiba como funcionam nossos sinais e entenda a importância do
                uso responsável.
              </Paragraph>
            </Box>

            <Link to={`/${app?.slug}/app?tab=legal`}>
              <MuiButton
                variant="contained"
                sx={{
                  mt: 1.5,
                  height: 38,
                  background: app?.theme?.primaryColor,
                  '&:hover': {
                    background: app?.theme?.primaryColor
                  }
                }}
              >
                Ver mais
              </MuiButton>
            </Link>
          </CardContent>
        </Card>
      </Box>
    </Fragment>
  );
}
