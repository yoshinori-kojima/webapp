import express, {Router, Request, Response} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import Op from jsonwebtoken
import authenticate from '../authenticate.js';

import DbCtx from '../../../shared/src/data/db/db';
import { menu, menuAttributes } from '../../../shared/src/data/db/models/init-models';
import { where, Op } from 'sequelize';

//API parames
import { MenuGetPramas } from '../../../shared/src/data/api/models/apiModels';
//Data
import { FuncTreeNode } from '../../../shared/src/data/dataCommon';

const router: express.Router = Router();

router.get('/', authenticate, async (req:any, res:express.Response) => {
  let params = req.query as MenuGetPramas;
  let menuList: menu[] | null = [];

  try{
    let dbCtx : DbCtx = new DbCtx();
    // where条件を動的に構築
    const whereConditions : any = {};
    whereConditions.role_id = params.roleId;  //ロールID
    //console.log('roleId:' + params.roleId);
    menuList = await dbCtx.models.menu.findAll({ where: whereConditions });

    if(menuList === null){
      //データなし
      res.status(401).json({message: 'menuList not found'});
      return;
    }else{
      //データあり
      let list = menuList.map((menu => menu.toJSON()));

      let funcTreeNodeList : FuncTreeNode[] = [];
      list.map((menu, index) => {
        let node = funcTreeNodeList.find((node) => node.id === menu.subsys_id);
        //let node = funcTreeNodeList.find((node) => { return node.id === menu.subsys_id; });  //ブロック付きのアロー関数の場合はreturnが必要

        if(node === undefined){
          //要素なし  サブシステムと機能を追加
          funcTreeNodeList.push({
            nodeType: 1,
            id: menu.subsys_id || '',
            name: menu.subsys_name || '',
            routes: '',
            children: [
              {
                nodeType: 2,
                id: menu.func_id,
                name: menu.func_name,
                routes: menu.func_routes,
                children: [],
              }
            ]
          });
        }else{
          //要素あり 機能を追加
          node?.children?.push({
            nodetype: 2,
            id: menu.func_id,
            name: menu.func_name,
            routes: menu.func_routes,
            children: [],
          });
        }
      });

      res.status(200).json({
        message: 'ok',
        data: {
          menu: funcTreeNodeList,
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