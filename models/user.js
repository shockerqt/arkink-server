import { Model, DataTypes } from 'sequelize';
import Character from './character.js';

import sequelize from './sequelize.js';

export default class User extends Model {}

User.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // username: {
  //   type: DataTypes.STRING,
  // },
  // discriminator: {
  //   type: DataTypes.STRING,
  // },
  // avatar: {
  //   type: DataTypes.STRING,
  // },
  // banner: {
  //   type: DataTypes.STRING,
  // },
  // locale: {
  //   type: DataTypes.STRING,
  // },
  accessToken: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
});

User.hasMany(Character);
Character.belongsTo(User);
