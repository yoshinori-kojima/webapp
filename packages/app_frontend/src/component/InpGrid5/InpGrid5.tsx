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
import { DataGrid, GridColDef, GridToolbar, GridApi, GridRowModel, GridCellParams, GridValidRowModel } from '@mui/x-data-grid';
import { AlternateEmail, Copyright } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import CustomTextField from '../../control/CustomTextField';
import {LoginData} from '../../../data/dataCommon';
import {z} from 'zod';

import { staff, staffAttributes } from '../../../data/db/models/init-models';


import { useNavigate } from 'react-router-dom';
import { getLoginUser } from '../../utils/getLoginUser';

import NavigationBar from '../navigationbar/NavigationBar';
import SideBar from '../sidebar/SideBar';
import { ClassNames } from '@emotion/react';
import { from, NumberComparer } from 'linq-to-typescript';

// Zodスキーマを定義
//const schema = z.object({
//  data: z.array(
//    z.object({
//      id: z.number(),
//      name: z.string().min(1, '名前は必須です'),
//      age: z
//        .number()
//        .min(0, '年齢は0以上で入力してください')
//        .max(120, '年齢は120以下で入力してください'),
//    })
//  ),
//});
// Zodスキーマを定義
const schema = z.object({
  id: z.number(),
  name: z.string().min(1, '名前は必須です'),
  age: z.string().regex(/^[0-9]*$/, { message:'入力文字が不正です。'}).transform((val) => Number(val)).pipe(z.number().min(18, '年齢は18以上で入力してください').max(120, '年齢は120以下で入力してください')),
});

//type formSchema = z.infer<typeof schema>;

type FormValues = {
  rows: { id: number; name: string; age: number }[];
};

const initialRows = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
];

const InpGrid5: React.FC = () => {
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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      data: initialRows,
    },
  });

  const [rows, setRows] = useState(initialRows);
  const [formErrors, setFormErrors] = useState<{ [rowId: number]: { [colnumName: string]: string | null } } >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [currentEditField, setCurrentEditField] = useState<string | null>(null);

  // フォームの送信ハンドラー
  const onSubmit: SubmitHandler<FormValues>  = async (data) => {
  //const onSubmit = (data: any) => {
  //const onSubmit: SubmitHandler<formSchema>  = async (data) => {
    //console.log('Form data:', data);
    const result = schema.safeParse(rows);
    if (!result.success) {
      // ZodのバリデーションエラーをReact Hook Formに反映
      result.error.issues.forEach((issue) => {
        const rowIndex = issue.path[0]; // エラー行のインデックス
        const field = issue.path[1]; // エラーのフィールド
        setFormErrors((prev) => ({
          ...prev,
          [rowIndex]: { ...prev[rowIndex as number], [field]: issue.message },
        }));
      });
      console.log('validation ng');
      return;
    }
    console.log('validation success');
  };

  // DataGridの列設定
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
      renderCell: (params: GridCellParams) => {
        const hasError = formErrors[params.id as number]?.name;
        return(
          <Tooltip title={hasError || ''} open = {Boolean(hasError)} arrow
            componentsProps={{
              tooltip: {
                sx: { backgroundColor: 'red', color: 'white', fontSize: '0.875rem' },
              },
              arrow: { sx: { color: 'red' } },
            }}
          >
            <span style={{ color: hasError ? 'red' : 'black' }}> {params.value as string} </span>
          </Tooltip>
        );
      },
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 100,
      editable: true,
      renderCell: (params: GridCellParams) => {
        const hasError = formErrors[params.id as number]?.age;
        return(
          <Tooltip title={hasError || ''} open = {Boolean(hasError)} arrow
            componentsProps={{
              tooltip: {
                sx: { backgroundColor: 'red', color: 'white', fontSize: '0.875rem' },
              },
              arrow: { sx: { color: 'red' } },
            }}
          >
            <span style={{ color: hasError ? 'red' : 'black' }}> {params.value as string} </span>
          </Tooltip>
        );
      },
      //valueParser: (value) => {
      //  const parsedValue = Number(value);
      //  return isNaN(parsedValue) ? '' : parsedValue;
      //}
    },
  ];

  const handleCellEditStart = (params: any) => {
    setCurrentEditField(params.field); // 編集を開始したカラム名を保存
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel): GridValidRowModel | Promise<GridValidRowModel> => {
    const { id } = newRow;
    if (currentEditField) {
      console.log('field:' + currentEditField);
      try {
        schema.pick({ [currentEditField]: true } as Record<'name' | 'age', true>).parse({ [currentEditField]: newRow[currentEditField] });
        // エラーが解消された場合、エラーをクリア
        setFormErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], [currentEditField]: null },
        }));
        setFormError(null);  // フォームエラーをクリア

        //最終行にデータが入力された場合、新しい行を追加
        if(newRow.id === rows.length){
          // 行の更新処理
          setRows((prevRows) =>
            prevRows.map((row) => (row.id === newRow.id ? (newRow as { id: number; name: string; age: number }) : row))
          );
          const addRow = {id: rows.length + 1, name: '', age: 0};
          setRows((prevRows) => [...prevRows, addRow]);

          console.log(rows);
        }
      } catch (e) {
        if (e instanceof z.ZodError) {
          console.log('error:' + e.errors[0].message);
          const errorMessage = e.errors[0].message;
          setFormErrors((prev) => ({
            ...prev,
            [id]: { ...prev[id], [currentEditField]: errorMessage },
          }));
          setFormError(errorMessage);  // フォーム全体のエラーメッセージを設定
          console.log(formErrors);
          // エラーメッセージを設定し、失敗した行を返す
          return { ...newRow, error: e.errors[0].message };
          //throw e;
        }
      }
    }
    return newRow as GridValidRowModel;
  };


  return (
    //<Box
    //  component="form"
    //  onSubmit={handleSubmit(onSubmit)}
    //  //noValidate sx={{ mt: 1 }}
    //  //sx={{
    //  //  marginTop: 8,
    //  //  display: 'flex',
    //  //  flexDirection: 'column',
    //  //  alignItems: 'center',
    //  //}}
    //>
    //</Box>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ p: 1, backgroundColor: formError ? 'rgba(255,0,0,0.1)' : 'transparent', color: 'red', mb: 1, minHeight: '1.5em' }}>
        {formError ? formError : ''}
      </Box>
      <DataGrid
        //editMode="row"
        //editMode="cell"
        rows={rows}
        columns={columns}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          //console.error('行更新エラー:', error);
        }}
        onCellEditStart={handleCellEditStart}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}
export default InpGrid5;