import type { FC } from 'react';
import React, { useEffect } from 'react';
import { Grid2,  Typography, Card, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLoginUser } from '../../utils/getLoginUser';
import NavigationBar from '../navigationbar/NavigationBar';
import SideBar from '../sidebar/SideBar';
import { from, NumberComparer } from 'linq-to-typescript';
//コンポーネント
import Footer from '../Footer/Footer';

const Top: React.FC = () => {
  const navigate = useNavigate();
  const text : string = "【実行環境】\n  ・AWS(EC2)\n\n【Webサーバー】\n ・nginx\n\n【フロントエンド】\n ・React\n\n【バックエンド】\n ・Express\n\n【DB】\n ・PostgreSQL"
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        <Grid2 size={{xs:1,md:3}} >
          <SideBar />
        </Grid2>
        <Grid2 size={{xs:10,md:8}} >
          <Typography variant="h6" align="center">Web App トップページ</Typography>

        <Card
          sx={{
            height: 400,
            width: isMobile ? 250 : 300, // 画面幅に応じて幅を調整
            margin: 'auto',
            padding: 2,
            textAlign: 'left', whiteSpace: 'pre-line'
          }}
        >
          {text}
        </Card>


        </Grid2>
        <Footer />
      </Grid2>
    </>
  );
};
export default Top;