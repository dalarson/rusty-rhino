import './App.css'
import "@mantine/core/styles.css"
import React from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client'
import { Main } from './Main';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MsalProvider } from '@azure/msal-react';
import { BrowserCacheLocation, Configuration, PublicClientApplication } from '@azure/msal-browser';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000
    }
  }
})


const entraConfiguration: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: `https://login.microsoftonline.us/common`,
    redirectUri: window.location.origin
  }, cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
    cacheMigrationEnabled: true
  }
}

const msalInstance = new PublicClientApplication(entraConfiguration);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme='dark'>
          <MsalProvider instance={msalInstance}>
            <AuthProvider>
              <Main />
            </AuthProvider>
          </MsalProvider>
        </MantineProvider>
      </QueryClientProvider>
    </React.StrictMode>
  </>
);