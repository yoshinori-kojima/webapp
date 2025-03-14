import { menu as _menu } from "./menu.js";
import { users as _users } from "./users.js";
export { _menu as menu, _users as users, };
export function initModels(sequelize) {
    const menu = _menu.initModel(sequelize);
    const users = _users.initModel(sequelize);
    return {
        menu: menu,
        users: users,
    };
}
