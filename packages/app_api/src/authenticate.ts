import express from 'express';
import  jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET    : string = 'secret';

//認証状態をチェック
const authenticate = (req:any, res:express.Response, next:any) => {
  try{
    //const token   = req.headers.authorization;
    const token = req.cookies.token;
    const decoded : string = jwt.verify(token, SECRET) as string;
    //jwt.verify(token, SECRET, (err: any, payload:any ) => {
    //console.log("decode:" + JSON.stringify(decoded, null, 1));
    //});
    //req.jwtPayload = JSON.stringify(decoded, null, 1);
    req.jwtPayload = decoded;
    next();
  }catch(err){
    res.status(400).json({message: 'Unauthorized'});
  }
};

export default authenticate;