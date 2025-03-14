import express, {Router, Request, Response} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import authenticate from '../authenticate.js';

import DbCtx from '../../../shared/src/data/db/db';
import { users } from '../../../shared/src/data/db/models/init-models';

const router: express.Router = Router();

router.post('/', async (req:express.Request, res:express.Response) => {
  try {
    res.clearCookie('token', {
      //httpOnly: true,       // JavaScriptからCookieにアクセスできないようにする
      //secure: true,         // HTTPSを使用する場合はtrueに設定
      sameSite: 'strict',   // クロスサイトリクエストを制限
    });

    const body = {
      messge: 'logout',
    };
    res.status(200).json(body);
    return;
  }catch(e){
    res.status(401).json({message: 'logout error'});
    return;
  }
});

export default router;