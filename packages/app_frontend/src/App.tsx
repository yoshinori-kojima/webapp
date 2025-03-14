import type { FC, JSX } from 'react';
import React, {useEffect, useState}  from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from 'component/login/Login';
import Top from 'component/top/Top';
import ViewA from 'component/viewA/ViewA';
import './App.css';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const App: FC = () => {
  const defaultTheme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: `linear-gradient(to right bottom, #FFFFFF, #DDDDDD)`,    //背景色にグラデーションを設定する場合
          },
        },
      },
    }
  });

  return (
  <>
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline/>
      <Routes>
        <Route path="/"        element={<Login  />} />
        <Route path="login"    element={<Login  />} />
        <Route path="top"      element={<Top    />} />
        <Route path="viewA"    element={<ViewA  />} />
        {/* ルートが存在しない場合は/Loginにリダイレクト */}
        <Route path="*"        element={<Navigate to = "/Login" />} />
      </Routes>
    </ThemeProvider>
  </>
  );
}

export default App
