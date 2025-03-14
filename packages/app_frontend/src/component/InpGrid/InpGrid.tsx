import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import { useForm, useFormContext  } from 'react-hook-form';
import { zodResolver} from '@hookform/resolvers/zod';
import { SubmitHandler, Controller } from 'react-hook-form';
//import { FormSchema, formSchema} from './schemas';

import {
   TextField, MenuItem, Select, Grid, Button, Typography, Container, Card, createTheme, ThemeProvider, CssBaseline, Box, Avatar, Stack, styled, Drawer
  ,Dialog ,DialogActions, DialogContent, DialogTitle
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


// Zodスキーマ
const formSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  age: z.number().min(18, "年齢は18以上でなければなりません").max(100, "年齢は100以下でなければなりません"),
});

type FormValues = z.infer<typeof formSchema>;

const initialRows = [
  { id: 1, name: 'Taro', age: 25 },
  { id: 2, name: 'Hanako', age: 32 },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: '名前', editable: true, width: 150 },
  { field: 'age', headerName: '年齢', editable: true, type: 'number', width: 150 },
];

//const columns: GridColDef[] = [
//  { field: 'id'      , headerName: 'ID'       , width: 100 , headerClassName: 'super-app-theme--header', },
//  { field: 'username', headerName: 'User Name', width: 150 , headerClassName: 'super-app-theme--header', editable:true, renderCell: (params) => <EditableCell params={params} field="username" />, },
//  //{ field: 'username', headerName: 'User Name', width: 150 , headerClassName: 'super-app-theme--header', editable:true, },
//  { field: 'userkana', headerName: 'User Kana', width: 150 , headerClassName: 'super-app-theme--header', editable:true, },
//  { field: 'dmy'     , headerName: ''         , flex: 1    , headerClassName: 'super-app-theme--header'  },
//];

//// EditableCellコンポーネント：React Hook FormとZodバリデーションを統合
//const EditableCell: FC<{ params: any; field: string }> = ({ params, field }) => {
//  const { control, setValue } = useFormContext();
//
//  return (
//    <Controller
//      name={`row-${params.id}-${field}`}
//      control={control}
//      defaultValue={params.value}
//      render={({ field: { onChange, value }, fieldState: { error } }) => (
//        <TextField
//          variant="outlined"
//          value={value}
//          onChange={(e) => {
//            onChange(e.target.value);
//            setValue(`row-${params.id}-${field}`, e.target.value);
//          }}
//          error={!!error}
//          helperText={error ? error.message : ""}
//        />
//      )}
//    />
//  );
//};

/*
  return (
    <Controller
      name={`row-${params.id}-${field}`}
      control={control}
      defaultValue={params.value}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          variant="outlined"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setValue(`row-${params.id}-${field}`, e.target.value);
          }}
          error={!!error}
          helperText={error ? error.message : ""}
        />
      )}
    />
  );
};
*/


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


const rows1 = [
  { id: 1, username: 'username', userkana: 'userkana', dmy: '' },
];

const InpGrid: React.FC = () => {
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
  const [formError, setFormError] = useState<string | null>(null);

  // React Hook FormとZodの統合
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  // フォームのサブミット処理
  const onSubmit = (data: FormValues) => {
    console.log('フォームデータ:', data);
  };

  // 行の更新処理 (データグリッド)
  const processRowUpdate = (newRow: any, oldRow: any) => {
    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
    setRows(updatedRows);

    // Zodによるセルデータのバリデーション
    try {
      formSchema.parse({
        name: newRow.name,
        age: newRow.age,
      });
      setFormError(null);  // フォームエラーをクリア
    } catch (e) {
      if (e instanceof z.ZodError) {
        e.errors.forEach((err) => {
          const errMsg = e.errors[0].message;
          setError(err.path[0] as keyof FormValues, { message: err.message });
          setFormError(errMsg);  // フォーム全体のエラーメッセージを設定
        });
        throw e;
      }
    }
    return newRow;
  };

  const handleProcessRowUpdateError = (error: Error) => {
    console.error('エラー:', error.message);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* フォーム入力 */}
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="名前"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name="age"
          control={control}
          defaultValue={18}
          render={({ field }) => (
            <TextField
              {...field}
              label="年齢"
              type="number"
              error={!!errors.age}
              helperText={errors.age?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          送信
        </Button>
      </form>

      {/* データグリッド */}
      {formError && (
        <Box sx={{ p: 1, backgroundColor: 'rgba(255,0,0,0.1)', color: 'red', mb: 1 }}>
          <Typography variant="body2">{formError}</Typography>
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        //experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};


  ////------------------------------------//
  ////FormSchema                          //
  ////------------------------------------//
  //const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
  //  resolver: zodResolver(formSchema),
  //  defaultValues: {
  //    name: '',
  //    age: 0,
  //  }
  //});

  //const columns = [
  //  { field: 'name', headerName: '名前', editable: true },
  //  { field: 'age', headerName: '年齢', editable: true, type: 'number' }
  //];

  //const rows = [
  //  { id: 1, name: 'Taro', age: 25 },
  //  { id: 2, name: 'Hanako', age: 32 }
  //];

  //const onCellEditCommit = (params: { field: "name" | "age"; value: any }) => {
  //  const { field, value } = params;

  //  setValue(field, value);

  //  handleSubmit(
  //    (data) => {
  //      console.log('Valid data:', data);
  //    },
  //    (errors) => {
  //      console.log('Validation errors:', errors);
  //    }
  //  )();
  //};

  //return (
  //  <div>
  //    <DataGrid
  //      rows={rows}
  //      columns={columns}
  //      onCellEditCommit={onCellEditCommit}
  //      autoHeight
  //    />
  //  </div>
  //);





  //const [rows, setRows] = useState<{ id: any; username: any; userkana: any; dmy:any }[]>([]);
  //const {
  //  control,
  //  handleSubmit,
  //  formState: { errors },
  //  getValues
  ////} = useForm<FormSchema>({
  //} = useForm({
  //  defaultValues:{
  //    rows: rows.reduce((acc: { [key: string]: any }, row) => {   //reduce関数は、rows配列を繰り返し処理して、新しいオブジェクトを作成するために使用 row.idを使ってユニークなキーを作成
  //      acc[`row-${row.id}-username`] = row.username;             //acc（アキュムレータ）は、reduceが走るたびに蓄積されるオブジェクト
  //      return acc;
  //    }, {}),
  //  },
  //  mode: "onChange",
  //  resolver: zodResolver(formSchema),
  //});


  //const [open, setOpen] = useState(false);
  //const handleClickOpen = () => {
  //  setRows([]);  //初期化
  //  setOpen(true);
  //};
  //const handleClose = (event: React.SyntheticEvent, reason: string) => {
  //  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
  //    setOpen(false);
  //  }
  //};

  //const navigate = useNavigate();

  //useEffect( () => {
  //  const navigateLogin = async () => {
  //    if(await getLoginUser() === undefined){
  //      await navigate('/login');
  //    };
  //  }
  //  navigateLogin();
  //}, [navigate]);

  //const [username, setUsername] = useState<string>('');

  //const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //  setUsername(event.target.value);
  //};

  //const displayAllProperties = (obj: { [key: string]: any }) => {
  //  for (const key in obj) {
  //    if (obj.hasOwnProperty(key)) {
  //      console.log(`${key}: ${obj[key]}`);
  //    }
  //  }
  //};

  //const dataGridRef = useRef<HTMLDivElement>(null);
  ////const dataRows = [{id:1, username:'12345', userkana:'12345'},];
  //const classes = useStyles();

  //const handleClick = () => {
  //  setRows(rows1);
  //}


{/*
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavigationBar />
      <Grid container spacing={2}></Grid>
        <Grid item xs={3}>
          <SideBar />
        </Grid>
        <Grid item xs={9} container justifyContent="center">
          <div style={{ height: 400 }}>

            <DataGrid rows={rows} columns={columns} />
            <DataGrid
              ref={dataGridRef}
              //rows={rows}
              rows={rows1}
              columns={columns}
              sx={{
                //'& .MuiDataGrid-columnHeaders': {
                //  backgroundColor: '#3f51b5',
                //  color: '#ffffff',
                //  borderRight : '1px solid #e0e0e0', // セルの右側の罫線
                //  borderBottom: '1px solid #e0e0e0', // カラムヘッダーの罫線
                //},
                '& .MuiDataGrid-cell': {
                  borderRight: '1px solid #e0e0e0', // セルの右側の罫線
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none', // デフォルトの列セパレータを非表示にする
                },

                //'.MuiDataGrid-columnHeaders': {
                //  backgroundColor: '#65b2c6',
                //  color: '#000000',
                //},
                '& .super-app-theme--header': {
                  backgroundColor: 'rgba(200, 230, 230, 0.55)',
                  color:'#000000',
                  borderRight : '1px solid #e0e0e0', // セルの右側の罫線
                  borderBottom: '1px solid #e0e0e0', // カラムヘッダーの罫線
                },
              }}

              getRowClassName={(params) => params.indexRelativeToCurrentPage  % 2 === 0 ? classes.evenRow : classes.oddRow}
              //pageSize={5}
              //rowsPerPageOptions={[5]}
            />
          </div>
        </Grid>
        <Button onClick={handleClick}>ボタン</Button>

    </ThemeProvider>
  );
            */}
//};
export default InpGrid;