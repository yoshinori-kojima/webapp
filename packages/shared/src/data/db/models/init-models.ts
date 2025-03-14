import type { Sequelize } from "sequelize";
import { menu as _menu } from "./menu.js";
import type { menuAttributes, menuCreationAttributes } from "./menu.js";
import { users as _users } from "./users.js";
import type { usersAttributes, usersCreationAttributes } from "./users.js";

export {
  _menu as menu,
  _users as users,
};

export type {
  menuAttributes,
  menuCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const menu = _menu.initModel(sequelize);
  const users = _users.initModel(sequelize);


  return {
    menu: menu,
    users: users,
  };
}
