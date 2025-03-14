import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface menuAttributes {
  role_id: number;
  sys_ord: number;
  sys_id?: string;
  subsys_ord: number;
  subsys_id?: string;
  subsys_name?: string;
  func_ord: number;
  func_id?: string;
  func_name?: string;
  func_routes?: string;
  version: number;
}

export type menuPk = "role_id" | "sys_ord" | "subsys_ord" | "func_ord";
export type menuId = menu[menuPk];
export type menuOptionalAttributes = "sys_id" | "subsys_id" | "subsys_name" | "func_id" | "func_name" | "func_routes";
export type menuCreationAttributes = Optional<menuAttributes, menuOptionalAttributes>;

export class menu extends Model<menuAttributes, menuCreationAttributes> implements menuAttributes {
  role_id!: number;
  sys_ord!: number;
  sys_id?: string;
  subsys_ord!: number;
  subsys_id?: string;
  subsys_name?: string;
  func_ord!: number;
  func_id?: string;
  func_name?: string;
  func_routes?: string;
  version!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof menu {
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
