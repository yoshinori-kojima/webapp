import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Grid2, Typography, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLoginUser } from '../../utils/getLoginUser';
import NavigationBar from '../navigationbar/NavigationBar';
import SideBar from '../sidebar/SideBar';
//コンポーネント
import Footer from '../Footer/Footer';

const ViewA: React.FC = () => {
  const navigate = useNavigate();

  useEffect( () => {
    const navigateLogin = async () => {
      if(await getLoginUser() === undefined){
        await navigate('/login');
      };
    }
    navigateLogin();
  }, [navigate]);

  return (
    <>
      <NavigationBar />
      <Grid2 container spacing={2} justifyContent="flex-start" alignItems="flex-start">
        <Grid2 size={{xs:3,md:3}} >
          <SideBar />
        </Grid2>
        <Grid2 size={{xs:8,md:8}} >
          <Typography variant="h6" align="center">ViewA</Typography>
        </Grid2>
        <Footer />
      </Grid2>
    </>
  );
};
export default ViewA;