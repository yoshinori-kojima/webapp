import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface usersAttributes {
  userid: number;
  usercd: number;
  username?: string;
  password?: string;
  userkana?: string;
  postcode?: string;
  address?: string;
  version?: number;
}

export type usersPk = "userid";
export type usersId = users[usersPk];
export type usersOptionalAttributes = "username" | "password" | "userkana" | "postcode" | "address" | "version";
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  userid!: number;
  usercd!: number;
  username?: string;
  password?: string;
  userkana?: string;
  postcode?: string;
  address?: string;
  version?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    usercd: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "users_usercd_key"
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    userkana: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    postcode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    version: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'dbuser',
    timestamps: false,
    indexes: [
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "userid" },
        ]
      },
      {
        name: "users_usercd_key",
        unique: true,
        fields: [
          { name: "usercd" },
        ]
      },
    ]
  });
  }
}
