import { components } from './components';

import { palette } from './palette';
import { typography } from './typography';

// ----------------------------------------------------------------------

const baseOptions = {
  palette,
  components,
  typography,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
};

export default baseOptions;
