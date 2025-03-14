import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
//router
import { useNavigate } from 'react-router-dom';
import { getLoginUser } from '../../utils/getLoginUser';
//ui
import { Stack, TextField, Grid, Button, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import CustomTextField from '../../control/CustomTextField';
//components
import NavigationBar from '../navigationbar/NavigationBar';
import SideBar from '../sidebar/SideBar';
//hook-form + zod
import { useForm ,SubmitHandler, Controller } from 'react-hook-form';
import { FormSchema, formSchema} from './schemas';
import * as z from 'zod';
import { zodResolver} from '@hookform/resolvers/zod';

//
import { AttributesClass } from '../../../data/db/models/AttributesClass'
import { division, divisionAttributes } from '../../../data/db/models/init-models';

const Staff: React.FC = () => {
  const navigate = useNavigate();
  useEffect( () => {
    const navigateLogin = async () => {
      if(await getLoginUser() === undefined){
        await navigate('/login');
      };
    }
    navigateLogin();
    // 初期のタブオーダーを設定
    //setTabOrder([0, 1]);
  }, [navigate]);
  //Refs
  const inputRefs = useRef<HTMLInputElement[]>([]);       // focusを当てるための参照
  //const inputRefs = useRef([]);       // focusを当てるための参照
  const [tabOrder, setTabOrder] = useState<number[]>([]);
  useEffect(() => {
    // 最初の要素にフォーカスを設定
    inputRefs.current[tabOrder[0]]?.focus();
  }, [tabOrder]);

  const {
    control,
    //register,
    handleSubmit,
    //reset,
    formState: { errors },
    getValues
  } = useForm<FormSchema>({
    defaultValues:{
      loginId: '',
      userName  : '',
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);  //ローディング中フラグ


  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const currentIndex = tabOrder.indexOf(index);
      const nextIndex = (currentIndex + 1) % tabOrder.length;
      console.log(nextIndex);
      console.log(inputRefs.current.length);
      console.log(inputRefs.current[currentIndex]);

      //if(nextIndex === 2){
      //  // @ts-ignore
      //  buttonRef.current?.focus();
      //}else{
        inputRefs.current[tabOrder[nextIndex]]?.focus();
        console.log('inputRef:' + inputRefs.current[tabOrder[nextIndex]]);
      //}
    }
  };

  return(
  <>
    {loading && <LoadingOverlay />}  {/* ローディング中はローディング画面を表示 */}
    <CssBaseline />
    <NavigationBar />
    <Grid container spacing={2}></Grid>
    {/* サイドバー */}
    <Grid item xs={3}>
      <SideBar />
    </Grid>
    {/* メイン画面 */}
    <Grid item xs={9}>
      <Controller
        name="loginId"
        control={control}
        render={({ field }) => (
          <TextField
            label="loginId"
            {...field}
            inputRef={(el) => (inputRefs.current[0] = el as HTMLInputElement)}
            onKeyDown={(e) => handleKeyDown(0, e as React.KeyboardEvent<HTMLInputElement>)}
            error={!!errors.loginId}
            helperText={errors.loginId && errors.loginId.message}
          />
        )}
      />
      <Button variant="contained" color="primary">
        更新
      </Button>
    </Grid>
  </>
  );
};
export default Staff;
