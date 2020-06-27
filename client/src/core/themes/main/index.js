import { createMuiTheme } from '@material-ui/core/styles';

import {
  greys,
  primaryColor,
  primaryColorLight,
  primaryColorDark,
  primaryColorContrastText,
  secondaryColor,
  secondaryColorLight,
  secondaryColorDark,
  secondaryColorContrastText
} from './variables';

export default createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true
    },
    MuiFormControl: {
      fullWidth: true
    },
    MuiInputLabel: {
      shrink: true
    },
    MuiInput: {
      disableUnderline: true
    },
    MuiSelect: {
      disableUnderline: true
    }
  },

  overrides: {
    MuiAutocomplete: {
      inputRoot: {
        padding: 0,
        '&[class*="MuiOutlinedInput-root"]': {
          padding: '0 9px',
          lineHeight: '18px',
          borderRadius: 20
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#318EDA !important'
        }
      },
      noOptions: {
        fontSize: 14
      },
      option: {
        fontSize: 14
      },
      popper: {
        zIndex: 9999
      },
    },
    MuiButton: {
      root: {
        borderRadius: '20px',
        textTransform: 'initial'
      },
      contained: {
        padding: '5px 30px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none'
        },
        '&:focus': {
          boxShadow: 'none'
        }
      },
      containedSizeLarge: {
        padding: '6px 40px'
      },
      containedSizeSmall: {
        padding: '4px 20px'
      },
      text: {
        padding: '6px 16px'
      }
    },
    MuiDialog: {
      root: {
        zIndex: '5000 !important'
      }
    },
    MuiPopover: {
      root: {
        zIndex: '5000 !important'
      }
    },
    MuiFab: {
      root: {
        boxShadow: 'none'
      }
    },
    MuiInputLabel: {
      root: {
        fontWeight: 500
      }
    },
    MuiInput: {
      root: {
        padding: '8px 12px',
        borderRadius: 20,
        border: '1px solid #DCDCDC'
      },
      formControl: {
        'label + &': {
          marginTop: 20
        }
      }
    },
    MuiInputBase: {
      input: {
        padding: 0,
        fontSize: 14
      }
    },
    MuiMenuItem: {
      root: {
        minHeight: 40,
        fontSize: 14
      }
    },
    MuiSelect: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent'
        }
      }
    },
    MuiTooltip: {
      popper: {
        zIndex: 3000
      }
    },
    MuiFormLabel: {
      root: {
        marginLeft: 10
      },
    },
    MuiPaper: {
      root: {
        padding: 10,
        backgroundColor: 'white',
        borderTop: '2px solid #1E74BB',
      },
      rounded: {
        borderRadius: 10,
      },
      elevation1: {
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 1px -1px, rgba(0, 0, 0, 0.08) 0px 1px 3px 0px'
      }
    }
  },

  palette: {
    background: {
      default: greys[100]
    },
    grey: greys,
    primary: {
      dark: primaryColorDark,
      light: primaryColorLight,
      main: primaryColor,
      contrastText: primaryColorContrastText
    },
    secondary: {
      dark: secondaryColorDark,
      light: secondaryColorLight,
      main: secondaryColor,
      contrastText: secondaryColorContrastText
    },
    text: {
      primary: greys[800],
      secondary: greys[500]
    }
  },

  typography: {
    fontFamily: '"Lato", "Open-Sans", sans-serif'
  }
});
