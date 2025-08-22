import { createTheme, responsiveFontSizes } from '@mui/material';
import merge from 'lodash.merge';

import baseOptions from './core/baseOptions';

// ----------------------------------------------------------------------

const useTheme = () => {
  const merged = merge({}, baseOptions, { direction: 'ltr' });

  let theme = createTheme(merged);
  theme = responsiveFontSizes(theme);

  theme.shadows[1] = '0px 4px 23px rgba(0, 0, 0, 0.12)';
  theme.shadows[2] = '0px 0px 21px 1px rgba(0, 0, 0, 0.07)';
  theme.shadows[3] = '0px 10px 30px rgba(0, 0, 0, 0.1)';
  theme.shadows[4] = '0px 7px 30px 3px rgba(0, 0, 0, 0.05)';

  return theme;
};

export default useTheme;
