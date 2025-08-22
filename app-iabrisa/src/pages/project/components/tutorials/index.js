import React, { Fragment, useEffect } from 'react';

import { Box } from '@mui/material';
import Header from 'components/header';
import { H3, Paragraph } from 'components/typography';

export default function Tutorials() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const videos = [
    {
      title: 'Boas vindas',
      description: 'Entenda como o AI Trader PRO funciona.',
      video: 'https://www.youtube.com/embed/NzTEZgFEr9k'
    }
  ];

  return (
    <Fragment>
      <Header title="Aulas" />

      <Box mt={3}>
        {videos.map((data, index) => {
          return (
            <Box key={index} mb={5}>
              <Box mb={2}>
                <H3>{data.title}</H3>
                <Paragraph color="text.disabled">{data.description}</Paragraph>
              </Box>

              <Box
                width="100%"
                sx={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden'
                }}
              >
                <iframe
                  width="100%"
                  src={data.video}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                  style={{
                    borderRadius: 4,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                ></iframe>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Fragment>
  );
}
