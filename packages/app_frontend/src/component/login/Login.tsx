import React, { useEffect, useRef, useState } from 'react';
import { useForm  } from 'react-hook-form'
import { SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
//mui
import { Button, Typography, Card, Box, Stack } from '@mui/material';
//zod
import { zodResolver} from '@hookform/resolvers/zod';
import { FormSchema, formSchema} from './schemas';
//コンポーネント
import Footer from '../../component/Footer/Footer';
//ローディング
import LoadingOverlay from '../../sub-components/view/LoadingOverlay';
//Data
import { LoginData } from '../../../../shared/src/data/dataCommon';
//
import CustomTextField from '../../control/CustomTextField';
import { getLoginUser } from '../../utils/getLoginUser';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tabOrder, setTabOrder] = useState<number[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);       // focusを当てるための参照
  const buttonRef = useRef<HTMLButtonElement>(null);      // focusを当てるための参照
  const [errMessage, setErrMessage] = useState<string | null>(null); //エラーメッセージ
  const navigate = useNavigate();

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
      password: '',
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema>  = async () => {
    const formData = getValues();
    const jsonData: LoginData = {loginId: `${formData.loginId}`, password: `${formData.password}`};

    setLoading(true); // ローディング開始
    try{
      await new Promise(resolve => setTimeout(resolve, 500)); // 1秒待機

      const response = await fetch('/api/login', {
        method: "POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(jsonData),
        },
      )
      //.then(response => response.json())
      .then(response => {
        if(response.status === 401){
          setErrMessage("ログインIDまたはパスワードが違います。");
          throw new Error("ログインIDまたはパスワードが違います。");
        }else{
          setErrMessage("");
        }
        return response.json()
      })
      .then(data =>  {
        return data;
      })
      .catch((e: DOMException) => {
        return ;
      });
      //console.log(response);
      if(response.status === 401){
        return;
      }
      await navigate('/top');
    }catch(e){
      console.log(e);
    }finally{
      setLoading(false); // ローディング終了
    }
    return;
  };

  useEffect( () => {
    //ログイン時はTopに遷移
    const navigateTop = async () => {
      if(await getLoginUser() !== undefined){
        await navigate('/top');
      };
    }
    navigateTop();

  }, [navigate]);

  useEffect(() => {
    // 初期のタブオーダーを設定
    setTabOrder([0, 1]);
  }, []);

  useEffect(() => {
    // 最初の要素にフォーカスを設定
    inputRefs.current[tabOrder[0]]?.focus();
  }, [tabOrder]);


  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const currentIndex = tabOrder.indexOf(index);
      const nextIndex = (currentIndex + 1) % tabOrder.length;
      console.log(nextIndex);

      if(nextIndex === 0){
        onSubmit(getValues());
      }else{
        inputRefs.current[tabOrder[nextIndex]]?.focus();
        console.log('inputRef:' + inputRefs.current[tabOrder[nextIndex]]);
      }
    }
  };

  return (
  <>
    {loading && <LoadingOverlay />}  {/* ローディング中はローディング画面を表示 */}
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '90vh',
      }}
    >
      {/* メインコンテンツとサイドバーをラップするコンテナ */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        //noValidate sx={{ mt: 1 }}
        sx={{
          marginTop: 1,
          //flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // 水平方向中央揃え
          flexGrow: 1,
        }}
      >
        <Card
          sx={{
            height: 450,
            width: { xs: 300, sm: 300, md: 300 }, // 画面幅に応じて幅を調整
            //maxWidth: { xs: 300, sm: 400, md: 500 }, // 画面幅に応じて幅を調整
            margin: 'auto',
            padding: 2,
          }}
        >
          <Typography sx={{m:2}} variant="h5">
            Web App
          </Typography>
          <Box sx={{ ml:5, display:"flex", flexDirection:"column", justfyContent:"center"}}>
          <Stack spacing={0}>
            {/* ログインID */}
            <CustomTextField
              label="ログインID"
              placeholder="ログインID"
              name="loginId"
              control={control}
              //inputRefs= {inputRefs}
              inputRef= {(el: any) => (inputRefs.current[0] = el as HTMLInputElement)}
              num = {0}
              onKeyDown = {(e) => handleKeyDown(0, e as React.KeyboardEvent<HTMLInputElement>)}
              errorProp = {errors.loginId}
            />
            {/* パスワード */}
            <CustomTextField
              label="パスワード"
              placeholder="パスワード"
              name="password"
              control={control}
              //inputRefs= {inputRefs}
              inputRef= {(el: any) => (inputRefs.current[1] = el as HTMLInputElement)}
              num = {1}
              onKeyDown = {(e) => handleKeyDown(1, e as React.KeyboardEvent<HTMLInputElement>)}
              errorProp = {errors.password}
              type="password"
            />
          </Stack>
          </Box>
          {/* Sign In */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ width:150, mt: 3, mb: 2 }}
            ref={buttonRef}
            style={{ margin: '8px 8px' }}
            //onClick={ asyncHandleClick }
          >
            Sign In
          </Button>
          <Box sx={{ p: 0.5, backgroundColor: errMessage ? 'rgba(255,0,0,0.1)' : 'transparent', color: 'red', mb: 1, minHeight: '1.5em' }}>
            {errMessage ? errMessage : ''}
          </Box>

          <Typography align="center" sx={{mb:3}}>稼働時間：月～金 08:00～16:00</Typography>
          <Typography align="center">ログインID：1234</Typography>
          <Typography align="center">パスワード ：12ab34cd</Typography>

        </Card>
      </Box>
      <Footer />
    </Box>
  </>
  );
};
export default Login;