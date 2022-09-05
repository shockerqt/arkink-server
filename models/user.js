import { Model, DataTypes } from 'sequelize';

import { sequelize } from './init.js';

export default class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
  },
  discriminator: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  banner: {
    type: DataTypes.STRING,
  },
  locale: {
    type: DataTypes.STRING,
  },
  accessToken: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
});

