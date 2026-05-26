import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#3b82f6',
      dark: '#2563eb',
      contrastText: '#fff',
    },
    background: {
      default: mode === 'dark' ? '#0f172a' : '#f1f5f9',
      paper: mode === 'dark' ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f8fafc' : '#1e293b',
      secondary: mode === 'dark' ? '#94a3b8' : '#64748b',
    },
    divider: mode === 'dark' ? '#334155' : '#e2e8f0',
  },
  typography: {
    fontFamily: `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`,
    fontSize: 14,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '11px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: mode === 'dark' ? '#94a3b8' : '#94a3b8',
          borderBottom: mode === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
          padding: '12px 16px',
        },
        body: {
          padding: '16px',
          borderBottom: mode === 'dark' ? '1px solid #1e293b' : '1px solid #f1f5f9',
          fontSize: '14px',
          color: mode === 'dark' ? '#e2e8f0' : '#1e293b',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#334155' : '#f8fafc',
          },
          '&:last-child td': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '12px',
        },
      },
    },
  },
});
