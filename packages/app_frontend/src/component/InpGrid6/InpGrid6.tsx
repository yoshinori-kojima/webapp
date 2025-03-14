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
import { DataGrid, GridColDef, GridToolbar, GridApi, useGridApiRef, GridRowModel, GridCellParams, GridValidRowModel } from '@mui/x-data-grid';
import { AlternateEmail, ControlPointDuplicate, Copyright } from '@mui/icons-material';
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
  rows: z.array(
     z.object({id: z.number(),
     name: z.string().min(1, '名前は必須です'),
     //age: z.string().regex(/^[0-9]*$/, { message:'入力文字が不正です。'}).transform((val) => Number(val)).pipe(z.number().min(18, '年齢は18以上で入力してください').max(120, '年齢は120以下で入力してください')),
     age: z.number().min(18, '年齢は18以上で入力してください').max(120, '年齢は120以下で入力してください'),
     }),
  ),
});

type FormValues = z.infer<typeof schema>;
//type FormValues = {
//  rows: { id: number; name: string; age: number }[];
//};

const initialRows = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
];

const InpGrid6: React.FC = () => {
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
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      rows: initialRows,
    },
  });

  const apiRef = useGridApiRef();

  const [rows, setRows] = useState(initialRows);
  const [formErrors, setFormErrors] = useState<{ [rowId: number]: { [colnumName: string]: string | null } } >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [currentEditField, setCurrentEditField] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<{ [key: number]: { [key: string]: string | null} }>({});

  // フォームの送信ハンドラー
  const onSubmit: SubmitHandler<FormValues>  = async (data) => {
    console.log('onSubmit');
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
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const hasError = formErrors[(params.id as number)]?.name;
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
      sortable: false,
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
      type: 'number',
      //valueParser: (value) => {
      //  const parsedValue = Number(value);
      //  return isNaN(parsedValue) ? '' : parsedValue;
      //}
    },
  ];

  const handleCellEditStart = (params: any) => {
    console.log('handleCellEditStart');
    setCurrentEditField(params.field); // 編集を開始したカラム名を保存
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel): GridValidRowModel | Promise<GridValidRowModel> => {
    const { id } = newRow;
    const updatedRows = rows.map((row) => (row.id === newRow.id ? (newRow as { id: number; name: string; age: number }) : row));
    console.log(updatedRows);
    console.log(currentEditField);
    if (currentEditField) {
      // カラムごとのバリデーションを実行
      const schemaForColumn = schema.shape.rows.element.shape[currentEditField as keyof typeof schema.shape.rows.element.shape]; // 特定のカラムのスキーマを取得
      //const result = schema.safeParse({ rows: updatedRows });

      const result = schemaForColumn.safeParse(newRow[currentEditField]);

      console.log(result);

      if (result.success) {
        console.log('Validation success');
        setValue('rows', updatedRows, { shouldValidate: false });
        //setValidationErrors({}); // バリデーションエラーをリセット
        setFormErrors((prev) => ({
          ...prev,
          [id]: { ...prev[id], [currentEditField]: null },
        }));
        //setFormErrors((prev) => ({
        //  ...prev,
        //  [id]: { ...prev[id], [currentEditField]: null },
        //}));
        setFormError(null);

        //最終行にデータが入力された場合、新しい行を追加
        if(newRow.id === rows.length){
          // 行の更新処理
          updatedRows.push({id: rows.length + 1, name: '', age: 0});
          setValue('rows', updatedRows, { shouldValidate: false });

          // 行を追加した後にスクロール
          setTimeout(() => {
            apiRef.current.scrollToIndexes({ rowIndex: updatedRows.length - 1 });
      });

        }
      } else {
        console.log('Validation error');
        setValue('rows', updatedRows, { shouldValidate: false });
        //setValue('rows', updatedRows, { shouldValidate: false });

        if(newRow.id !== rows.length){

          // バリデーションエラーがあれば、そのエラーメッセージを状態に保存
          const errors: { [key: number]: { [key: string]: string } } = {};
          //console.log(result.error.errors);
          result.error.errors.forEach((err) => {
            if (err.path.length === 3) {
              const rowId : number = err.path[1] as number;  // 行IDを取得
              if (!errors[rowId]) errors[rowId] = {};
              errors[rowId][err.path[2]] = result.error.errors[0].message;//err.message;  // 各カラムのエラーメッセージを保存
            }
          });
          setValidationErrors(errors);

          //console.log(errors[id - 1][currentEditField]);
          setFormErrors((prev) => ({
            ...prev,
            [id]: { ...prev[id], [currentEditField]: result.error.errors[0].message },
          }));
          setFormError(result.error.errors[0].message);  // フォーム全体のエラーメッセージを設定
        }
        //throw new Error('Validation failed');  // エラーがあった場合は行の更新を中止
        console.log(errors);
        console.log(validationErrors);
      }
    }
    setRows(updatedRows);
    return newRow;
  };


  const handleBlur = () => {
    console.log('handleBlur');
    const formRows = getValues('rows');
    const lastRow = getValues('rows').slice(-1)[0];
    if(lastRow.name === ''){
      console.log('name');
      formRows.pop();
      setValue('rows', formRows);
      setRows(formRows);
    }
  }

  const dataGridRef = useRef<HTMLDivElement | null>(null);


  const handleCellKeyDown = (params: GridCellParams, event: React.KeyboardEvent) => {
    setCurrentEditField(params.field); // 編集を開始したカラム名を保存
    if (event.key === "Enter") {
      console.log('Enter');
      event.preventDefault(); // Enterキーのデフォルト動作をキャンセル
      const columnIndex = columns.findIndex((col) => col.field === params.field);
      console.log('columnIndex:' + columnIndex);
      const nextColumnIndex = (columnIndex + 1) % columns.length; // 次の列
      console.log('nextColumnIndex:' + nextColumnIndex);
      const nextRowId = (params.row.id -1) + (nextColumnIndex === 0 ? 1 : 0); // 次の行
      console.log('nextRowId:' + nextRowId);
      const nextRow = rows[nextRowId];
      console.log(nextRowId);
      console.log(nextRow);

      if (nextRow) {
        // 次のセルをフォーカス & 編集モードにする
        const nextField = columns[nextColumnIndex].field;
        apiRef.current.setCellFocus(nextRow.id, nextField);
        setTimeout(() => {
          apiRef.current.startCellEditMode({
            id: nextRow.id,
            field: nextField,
          });
        });
      }
    }
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
      <div
        style={{ height: 320, width: '100%' }}
        onBlur={(event) => {
          // DataGrid外へのフォーカス移動を確認
          if (dataGridRef.current && !dataGridRef.current.contains(event.relatedTarget)) {
            handleBlur();
          }
        }}
        ref={dataGridRef}
      >
        <DataGrid
          //editMode="row"
          //editMode="cell"
          rows={rows}
          columns={columns}
          hideFooter={true} // フッター非表示
          disablePagination={true} // ページネーション無効
          disableColumnMenu={true} // 列メニュー全体を無効化
          apiRef={apiRef}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            //console.error('行更新エラー:', error);
          }}
          onCellEditStart={handleCellEditStart}
          onCellKeyDown={handleCellKeyDown} // キー押下イベント
          //onCellFocusIn={(params) =>{ console.log('onCellFocusIn'); }}
          onCellClick={(params) => {
            setCurrentEditField(params.field); // 編集を開始したカラム名を保存
            apiRef.current.startCellEditMode({
              id: params.id,
              field: params.field,
            });
          }}
          //sx={{
          //  '& .Mui-selected': {
          //    backgroundColor: '#e0f7fa !important',
          //    '&:hover': {
          //      backgroundColor: '#b2ebf2 !important',
          //    },
          //  },
          //}}
        />
      </div>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}
export default InpGrid6;