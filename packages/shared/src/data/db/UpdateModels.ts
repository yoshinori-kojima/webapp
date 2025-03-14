import { Sequelize } from 'sequelize';
import DbCtx from './db.js';
import {
  users, usersAttributes,
  menu, menuAttributes,
} from './models/init-models.js';

export async function Updateusers(attributes: usersAttributes, dbCtx : DbCtx, tx : any) : Promise<number> {
  let [affectedCount] = await dbCtx.models.users.update(attributes, { where: { userid: attributes.usercd, version: attributes.version }, transaction: tx });
  if(affectedCount === 0){
    throw new Error('更新対象が存在しません');
  }
  return affectedCount
}

export async function UpdateMenu(attributes: menuAttributes, dbCtx: DbCtx , tx : any) : Promise<number> {
  let [affectedCount] = await dbCtx.models.menu.update(attributes, { where: { role_id: attributes.role_id, sys_ord:attributes.sys_ord, subsys_ord:attributes.subsys_ord, func_ord:attributes.func_ord, version: attributes.version }, transaction: tx });
  if(affectedCount === 0){
    throw new Error('更新対象が存在しません');
  }
  return affectedCount
}
