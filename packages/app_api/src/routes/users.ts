import express, {Router, Request, Response} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import Op from jsonwebtoken
import authenticate from '../authenticate.js';

import DbCtx from '../../../shared/src/data/db/db';
import { users, usersAttributes } from '../../../shared/src/data/db/models/init-models';
import { where, Op } from 'sequelize';

const router: express.Router = Router();

router.get('/', authenticate, async (req:any, res:express.Response) => {
  let cnd : usersAttributes | null = req.query;
  let st: users[] | null = [];

  console.log('cnd:' + JSON.stringify(cnd));

  try{
    let dbCtx : DbCtx = new DbCtx();
    // where条件を動的に構築
    const whereConditions : any = {};

    if(cnd?.username !== ''){
      // ユーザ名
      whereConditions.username = {
        ...whereConditions.username,
        [Op.like] : `%${cnd?.username}%`
      }
    }

    st = await dbCtx.models.users.findAll({ where: whereConditions });

    if(st === null){
      //データなし
      res.status(401).json({message: 'user not found(st === null)'});
      return;
    }else{
      //データあり
      res.status(200).json({
          message: 'ok',
          data: {
            userss: st,
          }
        });
    }
  }catch{
      res.status(401).json({message: 'error db query'});
      return;
  }
  return;
});

export default router;