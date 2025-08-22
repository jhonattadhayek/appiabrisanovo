import React from 'react';

import { Box, styled } from '@mui/material';
import clsx from 'clsx';

export const H1 = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="h1"
      mb={0}
      mt={0}
      fontSize="28px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Outfit,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const H2 = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="h2"
      mb={0}
      mt={0}
      fontSize="24px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Outfit,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const H3 = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="h3"
      mb={0}
      mt={0}
      fontSize="18px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Outfit,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const H4 = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="h4"
      mb={0}
      mt={0}
      fontSize="16px"
      fontWeight="500"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Outfit,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const H5 = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="h5"
      mb={0}
      mt={0}
      fontSize="14px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Outfit,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const H6 = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="h6"
      mb={0}
      mt={0}
      fontSize="13px"
      fontWeight="600"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Outfit,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const Paragraph = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="p"
      mb={0}
      mt={0}
      fontSize="14px"
      {...props}
      fontFamily={
        "Open Sans,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const Small = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="small"
      fontSize="12px"
      fontWeight="500"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Open Sans,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const Span = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="span"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Open Sans,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

export const Tiny = props => {
  const { children, className, ellipsis, textTransform } = props;

  return (
    <StyledBox
      texttransformstyle={textTransform}
      ellipsis={ellipsis}
      className={clsx({ [className || '']: true })}
      component="small"
      fontSize="11px"
      lineHeight="1.5"
      {...props}
      fontFamily={
        "Open Sans,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
      }
    >
      {children}
    </StyledBox>
  );
};

const StyledBox = styled(Box)(({ texttransformstyle, ellipsis }) => ({
  textTransform: texttransformstyle || 'none',
  whiteSpace: ellipsis ? 'nowrap' : 'normal',
  overflow: ellipsis ? 'hidden' : '',
  textOverflow: ellipsis ? 'ellipsis' : ''
}));
