import { Model, DataTypes } from 'sequelize';

import sequelize from './sequelize.js';

export default class Character extends Model {}

Character.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nickname: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 60 },
  },
  class: {
    type: DataTypes.STRING,
  },
  ilvl: {
    type: DataTypes.FLOAT,
  },
  guild: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
});
