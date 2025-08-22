import React from 'react';

import { styled } from '@mui/material';
import FlexBox from 'components/flexBox';
import { Paragraph } from 'components/typography';
import PropTypes from 'prop-types';

export default function EmptyData(props) {
  const { label, icon: IconComponent } = props;

  return (
    <CustomCard justifyContent="center">
      <Paragraph color="text.disabled">
        {IconComponent && <IconComponent sx={{ mr: 2, mb: -1 }} />} {label}
      </Paragraph>
    </CustomCard>
  );
}

EmptyData.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.elementType
};

const CustomCard = styled(FlexBox)(() => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  textOverflow: 'ellipsis',
  width: '100%',
  padding: '16px 4px',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '10px',
  border: 'dotted 1px #ffffff80',
  borderRadius: '6px'
}));
