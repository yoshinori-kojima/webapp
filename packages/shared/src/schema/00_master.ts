import {z} from 'zod';

//ログインID
export const s_loginId      = () => z.string().regex(/^[a-zA-Z0-9]*$/, { message:'入力文字が不正です。'}).min(1, {message: '必須入力です。'}).max(15, { message: '15文字以下で入力してください。' });
//パスワード
export const s_password     = () => z.string().regex(/^[a-zA-Z0-9]*$/, { message:'入力文字が不正です。'}).min(1, {message: '必須入力です。'}).max(15, { message: '15文字以下で入力してください。' });
//事業所コード
export const s_divisionId   = () => z.string().regex(/^[1-9999]*$/, { message:'入力文字が不正です。'}).min(1, {message: '必須入力です。'}).max(4, { message: '4文字以下で入力してください。' });
//事業所名
export const s_divisionName = () => z.string().max(20, { message: '20文字以下で入力してください。' });
//ユーザ名
export const s_userName    =  () => z.string().min(1, {message: '必須入力です。'}).max(20, { message: '20文字以下で入力してください。' });