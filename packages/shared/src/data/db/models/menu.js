import { DataTypes, Model } from 'sequelize';
export class menu extends Model {
    role_id;
    sys_ord;
    sys_id;
    subsys_ord;
    subsys_id;
    subsys_name;
    func_ord;
    func_id;
    func_name;
    func_routes;
    version;
    static initModel(sequelize) {
        return menu.init({
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            sys_ord: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            sys_id: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            subsys_ord: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            subsys_id: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            subsys_name: {
                type: DataTypes.STRING(40),
                allowNull: true
            },
            func_ord: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            func_id: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            func_name: {
                type: DataTypes.STRING(40),
                allowNull: true
            },
            func_routes: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            version: {
                type: DataTypes.SMALLINT,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'menu',
            schema: 'dbuser',
            timestamps: false,
            indexes: [
                {
                    name: "pkey_menu",
                    unique: true,
                    fields: [
                        { name: "role_id" },
                        { name: "sys_ord" },
                        { name: "subsys_ord" },
                        { name: "func_ord" },
                    ]
                },
            ]
        });
    }
}
