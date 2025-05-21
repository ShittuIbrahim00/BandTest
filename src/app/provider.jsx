'use client';

import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles'; 
import CssBaseline from '@mui/material/CssBaseline';

// Define a basic MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // A nice blue for primary actions (Tailwind's blue-600)
    },
    secondary: {
      main: '#f97316', // A nice orange for secondary actions (Tailwind's orange-500)
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','), // Use Inter font
  },
});

export function Providers({ children }) {
    useEffect(() => {
        if (
          typeof window !== 'undefined' &&
          process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'
        ) {
          import('../mocks/browser')
            .then(({ worker }) => {
              worker.start({
                onUnhandledRequest: 'bypass',
              }).then(() => {
                console.log('MSW worker started!');
              });
            })
            .catch((err) => {
              console.error('Failed to start MSW', err);
            });
        }
      }, []);
      

  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline /> 
      {children}
    </ThemeProvider>
  );
}