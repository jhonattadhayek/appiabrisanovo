import { alpha } from '@mui/material';

export const components = {
  MuiTableCell: {
    styleOverrides: {
      root: {
        border: 'none'
      }
    }
  },
  MuiAvatar: {
    styleOverrides: {
      fallback: {
        height: '75%',
        width: '75%'
      }
    }
  },
  MuiLoadingButton: {
    styleOverrides: {
      root: {
        background: '#f1f0f0 !important'
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '6px !important',
        color: '#354052',
        boxShadow: 'none',
        padding: '0.6rem 1.5rem',
        '&.Mui-disabled': {
          color: 'rgba(0, 0, 0, 0.26)',
          backgroundColor: 'transparent'
        },
        '&:hover': {
          background: alpha('#5742b9', 0.05)
        }
      },
      outlinedPrimary: {
        borderColor: '#5742b9',
        color: '#5742b9',
        '&:hover': {
          borderColor: '#5742b9'
        }
      },
      containedPrimary: {
        color: 'white',
        backgroundColor: '#5742b9',
        '&.Mui-disabled': {
          color: 'rgba(0, 0, 0, 0.26)',
          backgroundColor: '#f3f1f1 !important'
        },
        '&:hover': {
          backgroundColor: '#5742b9',
          boxShadow: 'none'
        }
      }
    }
  },
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box'
      },
      html: {
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        height: '100%',
        width: '100%'
      },
      body: {
        height: '100%'
      },
      a: {
        color: 'inherit',
        textDecoration: 'none'
      },
      ul: {
        margin: 0,
        padding: 0,
        listStyle: 'none'
      },
      '#root': {
        height: '100%'
      },
      '#nprogress .bar': {
        zIndex: '9999 !important',
        backgroundColor: '#5742b9 !important',
        width: '100%',
        position: 'fixed'
      },
      'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button':
        {
          WebkitAppearance: 'none',
          margin: 0
        }
    }
  },
  MuiBreadcrumbs: {
    styleOverrides: {
      separator: {
        color: '#5742b9'
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid #eaecf0 !important'
      }
    }
  },
  MuiCardHeader: {
    defaultProps: {
      titleTypographyProps: {
        variant: 'h6'
      },
      subheaderTypographyProps: {
        color: '#94A4C4'
      }
    }
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#94A4C4'
      }
    }
  },
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        borderRadius: 3,
        overflow: 'hidden',
        color: '#5742b9'
      },
      bar: {
        color: '#5742b9'
      }
    }
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 'auto',
        marginRight: '16px'
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none'
      }
    }
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        boxShadow: 'none'
      }
    }
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: 0,
        minHeight: 0,
        '&.Mui-expanded': {
          minHeight: 'auto'
        },
        '.MuiAccordionSummary-content': {
          margin: 0
        },
        '.MuiAccordionSummary-content.Mui-expanded': {
          margin: 0
        }
      }
    }
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        paddingLeft: 0,
        paddingRight: 0
      }
    }
  },
  MuiRating: {
    styleOverrides: {
      root: {
        color: '#FFD600'
      }
    }
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        '& .MuiTableRow-root:last-of-type': {
          '& .MuiTableCell-root': {
            borderBottom: 0
          }
        }
      }
    }
  },
  MuiTab: {
    styleOverrides: {
      root: {
        color: '#94A4C4',
        textTransform: 'none',
        fontSize: 12,
        fontWeight: 600,
        padding: 0,
        minWidth: 'auto',
        marginLeft: '1rem',
        marginRight: '1rem'
      }
    }
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        '& .MuiButtonBase-root:first-of-type': {
          marginLeft: 0
        },
        '& .MuiButtonBase-root:last-of-type': {
          marginRight: 0
        }
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'transparent'
        }
      }
    }
  },
  MuiPopover: {
    styleOverrides: {
      root: {
        '& .MuiPopover-paper': {
          boxShadow: 'none',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }
      }
    }
  },
  MuiTabPanel: {
    styleOverrides: {
      root: {
        padding: 0
      }
    }
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#1c1c1ceb'
      },
      arrow: {
        color: '#1c1c1ceb'
      }
    }
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        borderRadius: '6px !important',
        fontFamily:
          "Open Sans,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol' !important"
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& input::placeholder': {
          color: '#94A4C4',
          opacity: 1
        },
        '& label': {
          color: '#94A4C4',
          opacity: 1,
          fontWeight: 500
        }
      }
    }
  }
};
