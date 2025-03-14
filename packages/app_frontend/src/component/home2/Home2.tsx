import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { zodResolver} from '@hookform/resolvers/zod';

import { TextField, MenuItem, Select, Grid, Button, Typography, Container, Card, createTheme, ThemeProvider, CssBaseline, Box, Avatar, Stack, styled, Drawer } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridApi } from '@mui/x-data-grid';
import { AlternateEmail, Copyright } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import {LoginData} from '../../../data/dataCommon';

import * as z from 'zod';

import { useNavigate } from 'react-router-dom';
import { getLoginUser } from '../../utils/getLoginUser';

import NavigationBar from '../navigationbar/NavigationBar';
import SideBar from '../sidebar/SideBar';

const Home2: React.FC = () => {
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
    //palette: {
    //  //background: { default: '#dddddd', },
    //  //background: { default: 'linear-gradient(#e66465, #9198e5)' },
    //  //background: { default: 'linear-gradient(to right bottom, #36EAEF, #6B0AC9)' },
    //  background: { default: 'linear-gradient(to right bottom, #430089, #82ffa1)' },
    //},
  }); //remove, this demo shouldn't need to reset the theme.

  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const navigate = useNavigate();

  useEffect( () => {
    const navigateLogin = async () => {
      if(await getLoginUser() === undefined){
        await navigate('/login');
      };
    }
    navigateLogin();
  }, [navigate]);

  const columns: GridColDef[] = [
    { field: 'usercd', headerName: 'usercd', width: 99 },
    { field: 'username', headerName: 'username', width: 99 },
    { field: 'userkana', headerName: 'userkana', width: 99 },
  ];

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavigationBar />
      <SideBar />
      <Drawer anchor="left" open={open} onClose={toggleOpen}>
        <p>hello</p>
      </Drawer>
      <h1>{import.meta.env.VITE_APP_TITLE}</h1>
      <button onClick={toggleOpen} >hoge</button>
      <label>Home2</label>





    </ThemeProvider>
  );
};
export default Home2;