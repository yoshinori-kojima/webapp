import type { FC } from 'react';
import React, {useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate, Link } from 'react-router-dom';
//atom
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentUserAtom, expandedAtom } from '../../atom';
//data
import  { users } from '../../../../shared/src/data/db/models/users';
//loading
import LoadingOverlay from '../../sub-components/view/LoadingOverlay';

const NavigationBar: React.FC = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);         //ユーザatom
  const [expanded, setExpanded] = useAtom(expandedAtom);                  //メニューの展開状態atom
  const [loading, setLoading] = useState(false);                          //ローディング表示
  const [user, setUser] = React.useState<users | undefined>(undefined);   //ユーザ
  const [username, setUsername] = React.useState<string | null>('');      //ユーザ名

  const navigate = useNavigate();
  useEffect( () => {
    const getUser = async () => {
      if(currentUser === undefined){
        //ユーザなし
        await console.log('user is undefined');

        const response = await fetch("/api/login/user", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'credentials': 'include' // クッキーを含めるために必要
          },
        })
        .then(response => {
          return response.json();
        })
        .catch((e: DOMException) => alert("error" + ":" + e.message));
        await setCurrentUser(response.data.users);   //ユーザをatomにセット
        await setUsername(response.data.users.username);
      }else{
        await setUsername((currentUser?.username ?? ''));
      }
    };
    getUser();
  }, [navigate]);

  const handleClick = async () => {
    try{
      setLoading(true); // ローディング開始
      await new Promise(resolve => setTimeout(resolve, 500));
      //ログアウト
      const response = await fetch("/api/logout", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'credentials': 'include' // クッキーを含めるために必要
        },
      }).then(response => {
        return response.json();
      }).catch((e: DOMException) => alert("error" + ":" + e.message));

      await clearLoginInfo(); // ログイン情報をクリア
      await navigate('/login'); // ログイン画面に遷移
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false); // ローディング終了
    }
  }

  const clearLoginInfo  = () => {
    //ユーザ情報をクリア
    setUser(undefined);
    //メニューの展開状態をクリア
    setExpanded([]);
  };

  return (
  <>
    {loading && <LoadingOverlay />}  {/* ローディング中はローディング画面を表示 */}
    <AppBar
      position="fixed"
      sx={{
         zIndex: (theme) => theme.zIndex.drawer + 1
        //,hight: '50px'
        ,padding: 0
      }}
    >
      <Toolbar sx={{
         padding:0
        ,backgroundColor: '#5599FF'
        }}>
        <Typography variant="h5">
          <Link to="/Top" style={{color:'white'}}>
           Web App
          </Link>
        </Typography>
        <Box sx={{ flexGrow: 0.98}} />
        <Typography variant="h6" component="div">
          {username}
        </Typography>
        <Button
          sx={{
             backgroundColor: '#FFFFFF'
            ,border: '1px solid'   // ボーダーの太さとスタイルを指定
            ,borderColor: '#000000' // ボーダーの色をテーマのプライマリカラーに設定
            ,color:'#000000'
            ,'&:hover': {
               backgroundColor: '#FFFFFF'
              ,borderColor: 'primary.main' // ボーダーの色をテーマのプライマリカラーに設定
            }
            ,marginLeft:5}}
          onClick={handleClick}
        >
          ログアウト
        </Button>
      </Toolbar>
    </AppBar>
  </>
  );
};
export default NavigationBar;