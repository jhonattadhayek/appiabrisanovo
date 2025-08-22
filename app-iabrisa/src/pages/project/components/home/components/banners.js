import React, { Fragment, useState } from 'react';
import Slider from 'react-slick';

import { Box } from '@mui/material';
import useApp from 'hooks/useApp';

export default function Banners() {
  const { app } = useApp();

  const banners = app?.pages?.home?.banners || [];

  const [sliderSettings] = useState({
    dots: true,
    infinite: !banners.length,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 8000,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    pauseOnHover: true,
    nextArrow: <></>,
    prevArrow: <></>
  });

  const senderImage = image => {
    return (
      <Box
        sx={{
          height: 260,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover !important',
          backgroundPositionY: 'center',
          background: '#191f24',
          color: '#fff',
          backgroundImage: `url(${image})`,
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      />
    );
  };

  if (banners.length === 0) {
    return <Fragment />;
  }

  return (
    <Fragment>
      <Slider {...sliderSettings}>
        {banners.map((element, index) => {
          return (
            <Box key={index}>
              {element.url ? (
                <a href={element.url} target="_blank" rel="noreferrer">
                  {senderImage(element.image)}
                </a>
              ) : (
                <Box>{senderImage(element.image)}</Box>
              )}
            </Box>
          );
        })}
      </Slider>
    </Fragment>
  );
}
