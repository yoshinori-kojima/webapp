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


const useStyles = makeStyles({
  evenRow: {
    backgroundColor: '#f5f5f5',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  columnHeaders: {
    backgroundColor: '#CDE8E8',  // カラムヘッダー全体の背景色を変更
    color: '#ffffff',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
    },
  },
});


// Zodによるバリデーションスキーマ
const schema = z.object({
  age: z
    .number()
    .min(18, { message: '年齢は18歳以上でなければなりません' })
    .max(100, { message: '年齢は100歳以下である必要があります' }),
});

type FormValues = z.infer<typeof schema>;

const initialRows = [
  { id: 1, name: 'Taro', age: 25 },
  { id: 2, name: 'Hanako', age: 17 }, // バリデーションエラー
];

const InpGrid3: React.FC = () => {
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

  const [rows, setRows] = useState(initialRows);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // React Hook Formの設定
  const { setError, clearErrors } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { age: undefined },
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: '名前', editable: false, width: 150 },
    {
      field: 'age',
      headerName: '年齢',
      editable: true,
      width: 150,
      renderCell: (params) => {
        const hasError = params.row.error;
        const isFocused = params.id === hoveredCell;
        return (
          <Tooltip title={hasError && isFocused ? params.row.error : ''} open={isFocused} arrow>
            <span
              style={{ color: hasError ? 'red' : 'black' }}
              onMouseEnter={() => setHoveredCell(params.id as number)}
              onMouseLeave={() => setHoveredCell(null)}
              tabIndex={0} // フォーカス可能にする
            >
              {params.value}
            </span>
          </Tooltip>
        );
      },
    },
  ];

  const processRowUpdate = (newRow: any, oldRow: any) => {
    try {



      const parsedValue = schema.parse({ age: Number(newRow.age) });
      clearErrors('age');
      setFormError(null);  // フォームエラーをクリア
      return { ...newRow, age: parsedValue.age, error: null };
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errMsg = e.errors[0].message;
        setError('age', { message: errMsg });
        setFormError(errMsg);  // フォーム全体のエラーメッセージを設定
        return { ...newRow, error: e.errors[0].message };
        //throw e;
      }
    }
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      {/* DataGridの上部にエラーメッセージを表示 */}
      {formError && (
        <Box sx={{ p: 1, backgroundColor: 'rgba(255,0,0,0.1)', color: 'red', mb: 1 }}>
          <Typography variant="body2">{formError}</Typography>
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="cell"
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.error('行の更新中にエラーが発生しました', error);
        }}
        //experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};

export default InpGrid3;