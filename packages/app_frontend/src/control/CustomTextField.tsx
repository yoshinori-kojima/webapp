import React from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
interface CustomTextFieldPorps {
  label         : string ;
  name          : string;
  placeholder   : string;
  control       : any;
  defaultValue? : string;
  //inputRefs     : any;
  inputRef     : any;
  num           : number;
  errorProp     : any;
  onKeyDown?    : (event: React.KeyboardEvent) => void;
};


const CustomTextField : React.FC<CustomTextFieldPorps> = ({
  label,
  name,
  placeholder,
  control,
  defaultValue = '',
  inputRef,
  //inputRefs,
  num,
  errorProp,
  onKeyDown,
  ...props
}) => {
  return(
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} >
      <Typography variant="subtitle1" component="label" htmlFor={name}
        sx={{
          mb: 0, // ラベルとテキストフィールドの間にマージンを追加
          display: 'block', // ラベルをブロック要素として表示
        }}
      >
        {label}
      </Typography>
      <Controller
        name = {name}
        control = {control}
        render={({ field }) => (
          <TextField
            id = {name}
            placeholder={placeholder}
            //label = {label}
            {...field}
            inputRef={inputRef}
            onKeyDown = {onKeyDown}
            error = {!!errorProp}   // !!は、errorPropがnullまたはundefinedの場合にfalseを返す
            helperText={errorProp ? errorProp.message : ' '}
            variant="outlined" //Outlined, Filled, Standard
            margin="none"  //密集マージン
            sx={{
              '& .MuiInputBase-root': {   //入力フィールドの全体のスタイルを設定
                height: '30px', // 入力エリアの高さを設定
                padding: '0 8px', // パディングを調整
                fontSize: '0.875rem', // フォントサイズを調整
              },
              '& .MuiOutlinedInput-input': { // 入力エリアのスタイルを設定
                padding: '0', // デフォルトのパディングをリセット
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center', // テキストを中央に配置
              },
            }}
            {...props}
          />
        )}
      />
    </Box>
  );
};

export default CustomTextField;