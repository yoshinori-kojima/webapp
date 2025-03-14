import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'jotai';
import { createTheme, CssBaseline, ThemeProvider} from '@mui/material';

import App from 'App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider>
        <CssBaseline />
        <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
