import './App.css'
import "@mantine/core/styles.css"
import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client'
import { Main } from './Main';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme='dark'>
          <AuthProvider>
            <Main />
          </AuthProvider>
        </MantineProvider>
      </QueryClientProvider>
    </React.StrictMode>
  </>
);