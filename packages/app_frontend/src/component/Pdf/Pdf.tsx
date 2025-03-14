import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
//router
import { useNavigate } from 'react-router-dom';
import { getLoginUser } from '../../utils/getLoginUser';
//ui
import { Grid, Button, createTheme, ThemeProvider, CssBaseline } from '@mui/material';

//components
import NavigationBar from '../navigationbar/NavigationBar';
import SideBar from '../sidebar/SideBar';

const Pdf: React.FC = () => {
  const defaultTheme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: `linear-gradient(to right bottom, #FFFFFF, #CCBBDD)`,    //背景色にグラデーションを設定する場合:
          },
        },
      },
    }
  });

  const navigate = useNavigate();

  useEffect( () => {
    const navigateLogin = async () => {
      if(await getLoginUser() === undefined){
        await navigate('/login');
      };
    }
    navigateLogin();
  }, [navigate]);

  const handleClick = async () => {
    const response = await fetch('/api/pdf', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'credentials': 'include' // クッキーを含めるために必要
      },
    }).then(response => {
      if(!response.ok){
        throw new Error('Network response was not ok');
      }
      return response.blob();
    }).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href = url;
      a.download = 'filename.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }).catch((e: DOMException) => {
      console.log('error:pdf' + e);
    });
  };

  return(
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavigationBar />
      <Grid container spacing={2}></Grid>
        <Grid item xs={3}>
          <SideBar />
        </Grid>
        <Grid item xs={9}>
          <Button variant="contained" color="primary"
            onClick = { () => handleClick()}
          >
            PDF
          </Button>
        </Grid>
    </ThemeProvider>
  );
};
export default Pdf;
