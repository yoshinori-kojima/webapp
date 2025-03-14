import express, {Router, Request, Response} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import authenticate from '../authenticate';

import DbCtx from '../../../shared/src/data/db/db';
import { users } from '../../../shared/src/data/db/models/init-models';

const router: express.Router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    let dbCtx : DbCtx = new DbCtx();
    const st  : users | null = await dbCtx.models.users.findOne({ where:{userid: req.body.loginId, password: req.body.password }}) as users;
    if(st === null){
      console.log('not found');
      res.status(401).json({message: 'user not found(st === null)'});
      return;
    }
  }catch(e){
    console.log(e);
    res.status(401).json({message: 'user not found'});
    return;
  }

  const payload = {loginId: req.body.loginId};
  const token = jwt.sign(payload, 'secret', {expiresIn: 120, algorithm: 'HS256'});
  const body = {
    messge: 'ok',
  };

  // JWTをCookieに保存
  res.cookie('token', token, {
    //httpOnly: true,       // JavaScriptからCookieにアクセスできないようにする
    //secure: true,         // HTTPSを使用する場合はtrueに設定
    sameSite: 'strict',   // クロスサイトリクエストを制限
    path: '/',
    maxAge: 3600000 // 1時間（ミリ秒単位）
  });

  console.log('login ok');

  res.status(200).json(body);
  return;
});

router.get('/user', authenticate, async (req:any, res:express.Response) => {
  try {
    let dbCtx : DbCtx = new DbCtx();
    const user : users = await dbCtx.models.users.findOne({ where: { userid: req.jwtPayload.loginId } }) as users;  //ログイン後であるためパスワードは不要

    if(user === null){
      //ユーザなし
      //return res.status(401).json({message: 'user not found(st === null)'});
      res.status(401).json({message: 'user not found(st === null)'});
      return;
    }else{
      //ユーザあり
      res.status(200).json({
          message: 'Hello',
          data: {
            users: user,
          },
      });
    }
  }catch{
    res.status(401).json({message: 'user not found'});
    return;
  }
});

export default router;
