import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import { useForm, useFormContext  } from 'react-hook-form';
import { zodResolver} from '@hookform/resolvers/zod';
import { SubmitHandler, Controller } from 'react-hook-form';
//import { FormSchema, formSchema} from './schemas';

import {
   TextField, MenuItem, Select, Grid, Button, Typography, Container, Card, createTheme, ThemeProvider, CssBaseline, Box, Avatar, Stack, styled, Drawer
  ,Dialog ,DialogActions, DialogContent, DialogTitle,
  Tooltip
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DataGrid, GridColDef, GridToolbar, GridApi } from '@mui/x-data-grid';
import { AlternateEmail, Copyright } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import CustomTextField from '../../control/CustomTextField';
import {LoginData} from '../../../data/dataCommon';
import * as z from 'zod';

import { staff, staffAttributes } from '../../../data/db/models/init-models';


import { useNavigate } from 'react-router-dom';
import { getLoginUser } from '../../utils/getLoginUser';

import NavigationBar from '../navigationbar/NavigationBar';
import SideBar from '../sidebar/SideBar';
import { ClassNames } from '@emotion/react';
import { from, NumberComparer } from 'linq-to-typescript';

// Zodスキーマを定義
const schema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1, '名前は必須です'),
      age: z
        .number()
        .min(0, '年齢は0以上で入力してください')
        .max(120, '年齢は120以下で入力してください'),
    })
  ),
});

const initialRows = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
];


const InpGrid4: React.FC = () => {
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

  // useFormを使ってフォームを設定し、Zodのバリデーションを設定
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      data: initialRows,
    },
  });

  // フォームの送信ハンドラー
  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  // DataGridの列設定
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      renderCell: (params) => (
        <Controller
          name={`data.${params.row.id - 1}.name`}
          control={control}
          defaultValue={params.value}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              size="small"
              error={Boolean(errors.data?.[params.row.id - 1]?.name)}
              helperText={errors.data?.[params.row.id - 1]?.name?.message}
            />
          )}
        />
      ),
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 100,
      renderCell: (params) => (
        <Controller
          name={`data.${params.row.id - 1}.age`}
          control={control}
          defaultValue={params.value}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              variant="outlined"
              size="small"
              error={Boolean(errors.data?.[params.row.id - 1]?.age)}
              helperText={errors.data?.[params.row.id - 1]?.age?.message}
            />
          )}
        />
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DataGrid
        rows={initialRows}
        columns={columns}
        autoHeight
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}
export default InpGrid4;