'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeRegistry({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const storedMode = localStorage.getItem('appThemeMode');
    if (storedMode === 'dark') {
      setMode('dark');
      document.documentElement.classList.add('dark');
    } else {
      setMode('light');
      document.documentElement.classList.remove('dark'); 
    }
  }, []);

  const toggleColorMode = React.useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('appThemeMode', newMode); 

      if (newMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2563eb', // blue-600
          },
          secondary: {
            main: '#f97316', // orange-500
          },
          ...(mode === 'dark' && {
            background: {
              default: '#121212', // A very dark gray
              paper: '#1e1e1e', // Slightly lighter dark gray for cards/surfaces
            },
            text: {
              primary: '#ffffff',
              secondary: '#a0a0a0',
            },
          }),
        },
        typography: {
          fontFamily: ['Inter', 'sans-serif'].join(','),
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> 
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}