import express, {Router, Request, Response} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import DbCtx from '../../../shared/src/data/db/db';
import { users } from '../../../shared/src/data/db/models/init-models';

const router =  Router();

router.get('/', async (req:any, res:express.Response) => {
  console.log('test');
  res.status(200).json({message: 'Hello'});
});

export default router;
