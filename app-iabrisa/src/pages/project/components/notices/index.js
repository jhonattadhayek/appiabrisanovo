import React, { Fragment, useEffect, useState } from 'react';

import { Box, Divider, Skeleton } from '@mui/material';
import FlexBox from 'components/flexBox';
import Header from 'components/header';
import { Paragraph, Tiny } from 'components/typography';
import Api from 'config/api';

export default function Notices() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('notices'));

    if (storedData) {
      setList(storedData.list);
      setLoading(false);

      setTimeout(() => {
        getNotices();
      }, 2000);
    } else {
      getNotices();
    }
  }, []);

  const getNotices = async () => {
    try {
      const { data } = await Api.get(`/crawlers/investing`);
      if (data.length > 0) {
        localStorage.setItem('notices', JSON.stringify({ list: data }));
        setList(data);
      }
    } catch (error) {
      console.error(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Header title="Notícias" />

      {!loading ? (
        <Box mt={3}>
          {list.map((elem, index) => {
            return (
              <Box key={index}>
                <a href={elem.link} target="_blank" rel="noreferrer">
                  <FlexBox gap={2}>
                    <img
                      src={elem.image}
                      style={{ width: 100, height: 70, borderRadius: 4 }}
                    />

                    <Box width="100%">
                      <Paragraph lineHeight={1.4}>{elem.title}</Paragraph>

                      <Tiny color="text.disabled">{elem.time}</Tiny>
                    </Box>
                  </FlexBox>
                </a>

                <Divider sx={{ borderColor: '#191f24', mt: 2, mb: 2 }} />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box mt={3}>
          {Array.from({ length: 4 }, (_, i) => i + 1).map(i => (
            <Box key={i + 1}>
              <FlexBox alignItems="center" gap={2}>
                <Skeleton width={100} height={85} />

                <Box width="100%">
                  <Skeleton width="70%" height={22} />
                  <Skeleton width={60} height={22} />
                </Box>
              </FlexBox>

              <Divider sx={{ borderColor: '#191f24', mt: 2, mb: 2 }} />
            </Box>
          ))}
        </Box>
      )}
    </Fragment>
  );
}
