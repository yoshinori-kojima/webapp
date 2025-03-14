import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { zodResolver} from '@hookform/resolvers/zod';

import { TextField, MenuItem, Select, Grid, Button, Typography, Container, Card, createTheme, ThemeProvider, CssBaseline, Box, Avatar, Stack, styled, Drawer } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridApi } from '@mui/x-data-grid';
import { AlternateEmail, Copyright } from '@mui/icons-material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LensSharp from '@mui/icons-material/LensSharp';
import FolderIcon from '@mui/icons-material/Folder';

import {LoginData} from '../../../data/dataCommon';

import * as z from 'zod';

import { useNavigate } from 'react-router-dom';
import { getLoginUser } from '../../utils/getLoginUser';

import NavigationBar from '../navigationbar/NavigationBar';
import SideBar from '../sidebar/SideBar';
import CustomTextField from '../../control/CustomTextField';



//const Card = styled('div')({
//  backgroundColor: '#fff',
//  padding: '100px',
//  paddingTop: '50px',
//  paddingBottom: '50px',
//  borderRadius: '10px',
//  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//});



const Design: React.FC = () => {
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
  <>
    <NavigationBar />
    <SideBar />
    <CssBaseline />
    {/*
    <Grid
      container
      direction="column" // 縦方向のレイアウト
      alignItems="flex-start" // 中央揃え
      justifyContent="flex-start" // 上部揃え
      style={{ minHeight: '90vh', paddingTop: '10px' }} // 全体の高さと上部のスペース
    >
    </Grid>
    */}
    <Box
      display="flex"
      justifyContent="flex-start" // 中央揃え
      alignItems="flex-start" // 上部揃え
      height="90vh" // ビューポートの高さを全て使用
      width="70vw" // ビューポートの高さを全て使用
      paddingTop={3} // 上部に少しスペースを追加
      //sx={{
      //  margin:0,
      //  padding: 0,
      //}}
    >
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle1" component="label" htmlFor="search-field"
            sx={{
              mb: 0, // ラベルとテキストフィールドの間にマージンを追加
              display: 'block', // ラベルをブロック要素として表示
              textAlign: 'left', // テキストを左揃え
            }}
          >
            検索
          </Typography>
          <TextField
            id="search-field"
            aria-labelledby="search-label"
            variant="outlined"
            fullWidth
            placeholder="検索"
          />
          <Typography variant="subtitle1" component="label" htmlFor="search-field"
            sx={{
              mb: 0, // ラベルとテキストフィールドの間にマージンを追加
              display: 'block', // ラベルをブロック要素として表示
              textAlign: 'left', // テキストを左揃え
            }}
          >
            検索
          </Typography>
          <TextField
            id="search-field"
            aria-labelledby="search-label"
            variant="outlined"
            fullWidth
            placeholder="検索"
          />
        </Grid>
    </Box>
    <Box display="flex" justifyContent="center" >
      <SimpleTreeView
        aria-label="basic tree"
        sx={{ height: 300, flexGrow: 1, maxWidth: 200, overflowY: 'auto'
        }}
      >
        <TreeItem
          sx={{
             '& .MuiTreeItem-label': {
                fontWeight : 'bold',
                fontSize   : '1.0em',
                //color: theme.palette.primary.main,
              },
              '& .MuiTreeItem-content': {
                padding: 1,
              },
            }}
        label={<Box display="flex" justifyContent="flex-start" >Root</Box>} itemId='root'>
          <TreeItem label={<Box display="flex" justifyContent="flex-start" style={{ marginLeft:20}} >Child 1</Box>} itemId='root-child1'>
            <TreeItem label="Child 1-1" itemId='root-child1-1' />
          </TreeItem>
          <TreeItem label="Child 2" itemId='root-child2'>
            <TreeItem label="Child 2-1" itemId='root-child2-1' />
          </TreeItem>
        </TreeItem>
      </SimpleTreeView>
    </Box>
  </>
  );
};
export default Design;