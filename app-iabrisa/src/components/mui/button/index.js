import React from 'react';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

export default function MuiButton(props) {
  const { loading, children, ...rest } = props;

  if (loading) {
    return (
      <LoadingButton loading {...rest}>
        {children}
      </LoadingButton>
    );
  }

  return <Button {...rest}>{children}</Button>;
}

MuiButton.propTypes = {
  children: PropTypes.any.isRequired
};
