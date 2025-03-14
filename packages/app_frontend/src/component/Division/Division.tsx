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

const Division: React.FC = () => {
  //スタイル
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
  });
  //
  const navigate = useNavigate();
  useEffect( () => {
    const navigateLogin = async () => {
      if(await getLoginUser() === undefined){
        await navigate('/login');
      };
    }
    navigateLogin();
    // 初期のタブオーダーを設定
    setTabOrder([0, 1]);
  }, [navigate]);
  //Refs
  const inputRefs = useRef<HTMLInputElement[]>([]);       // focusを当てるための参照
  //const inputRefs = useRef([]);       // focusを当てるための参照
  const [tabOrder, setTabOrder] = useState<number[]>([]);
  useEffect(() => {
    // 最初の要素にフォーカスを設定
    inputRefs.current[tabOrder[0]]?.focus();
  }, [tabOrder]);
  //
  const {
    control,
    //register,
    handleSubmit,
    //reset,
    formState: { errors },
    getValues
  } = useForm<FormSchema>({
    defaultValues:{
      divisionId  : '',
      divisionName: '',
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

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

  const handleClick = async () => {
    const formData = getValues();
    const div_id : string =  `${formData.divisionId}`;

    let attributes : AttributesClass<divisionAttributes> = new AttributesClass<divisionAttributes>();
    attributes.attributes  = {
      div_id  : parseInt(div_id),
      div_name: `${formData.divisionName}`,
      version : 0,
    };
    attributes.status = 1;
    //attributes.status = 2;

    console.log('attributes:' + JSON.stringify(attributes));
    //const response = await fetch('https://192.168.1.34:8080/api/division/' + div_id, {
    const response = await fetch('/api/division/' + div_id, {
      method: 'PUT',
      headers: {
        "Content-Type":"application/json",
        'credentials': 'include' // クッキーを含めるために必要
      },
      body:JSON.stringify(attributes),
    }).then(response => {
      if(!response.ok){
        throw new Error('Network response was not ok');
      }
      return response.blob();
    }).catch((e: DOMException) => {
      console.log('error:' + e);
    });
  };

  return(
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavigationBar />
      <Grid container spacing={2}></Grid>
      {/* サイドバー */}
      <Grid item xs={3}>
        <SideBar />
      </Grid>
        <Grid item xs={9}>
          <Stack spacing={2}>
{/*
              <Controller
                name="divisionId"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="事業所ID"
                    {...field}
                    inputRef={(el) => (inputRefs.current[0] = el as HTMLInputElement)}
                    onKeyDown={(e) => handleKeyDown(0, e as React.KeyboardEvent<HTMLInputElement>)}
                    error={!!errors.divisionId}
                    helperText={errors.divisionId && errors.divisionId.message}
                  />
                )}
              />
          */}

          <CustomTextField
            label="事業所ID"
            name="divisionId"
            control={control}
            inputRef= {(el: any) => (inputRefs.current[0] = el as HTMLInputElement)}
            num = {0}
            onKeyDown = {(e) => handleKeyDown(0, e as React.KeyboardEvent<HTMLInputElement>)}
            errorProp = {errors.divisionId}
          />
          <CustomTextField
            label="事業所名"
            name="divisionName"
            control={control}
            //inputRef= {inputRefs.current[1]}
            inputRef= {(el: any) => (inputRefs.current[1] = el as HTMLInputElement)}
            num = {1}
            onKeyDown = {(e) => handleKeyDown(1, e as React.KeyboardEvent<HTMLInputElement>)}
            errorProp = {errors.divisionName}
          />
          <Button variant="contained" color="primary"
            onClick = { () => handleClick()}
          >
            更新
          </Button>
          </Stack>
        </Grid>
    </ThemeProvider>
  );
};
export default Division;
