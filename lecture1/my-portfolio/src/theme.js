import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0071E3',
      light: '#2997FF',
      dark: '#0055B3',
    },
    secondary: {
      main: '#F5F5F7',
    },
    error: {
      main: '#FF2D55',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F7',
    },
    text: {
      primary: '#1D1D1F',
      secondary: '#6E6E73',
      disabled: '#86868B',
    },
    divider: '#D2D2D7',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1D1D1F',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1D1D1F',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1D1D1F',
    },
    body1: {
      color: '#6E6E73',
    },
    body2: {
      color: '#86868B',
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#0071E3',
          '&:hover': {
            backgroundColor: '#0077ED',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: '#E8E8ED',
        },
      },
    },
  },
});

export default theme;
