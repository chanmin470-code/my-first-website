import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#64B5F6',
      light: '#BBDEFB',
      dark: '#1E88E5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFD54F',
      light: '#FFF9C4',
      dark: '#F9A825',
    },
    background: {
      default: '#F0F7FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A237E',
      secondary: '#546E7A',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans KR", sans-serif',
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 44,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #E3F2FD',
        },
      },
    },
  },
});

export default theme;
