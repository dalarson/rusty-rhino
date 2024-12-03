import './App.css'
import "@mantine/core/styles.css"
import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client'
import { Main } from './Main';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <React.StrictMode>
      <MantineProvider defaultColorScheme='dark'>
        <AuthProvider>
          <Main />
        </AuthProvider>
      </MantineProvider>
    </React.StrictMode>
  </>
);