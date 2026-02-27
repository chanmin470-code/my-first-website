import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4ff',
      light: '#4dd3ff',
      dark: '#007acc',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#0a0e1a',
      paper: '#111827',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    divider: 'rgba(0, 180, 255, 0.15)',
    error: {
      main: '#ff4d6d',
    },
    success: {
      main: '#00e5a0',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00b4ff 0%, #0080cc 100%)',
          boxShadow: '0 0 15px rgba(0, 180, 255, 0.4)',
          '&:hover': {
            boxShadow: '0 0 25px rgba(0, 180, 255, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          border: '1px solid rgba(0, 180, 255, 0.15)',
          borderRadius: 12,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(0, 180, 255, 0.4)',
            boxShadow: '0 0 20px rgba(0, 180, 255, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(0, 180, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 180, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00b4ff',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d1425',
          borderBottom: '1px solid rgba(0, 180, 255, 0.2)',
          backgroundImage: 'none',
          boxShadow: '0 0 20px rgba(0, 180, 255, 0.1)',
        },
      },
    },
  },
});

export default theme;
