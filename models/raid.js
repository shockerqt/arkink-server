import { Model, DataTypes } from 'sequelize';

import User from './user.js';
import Character from './character.js';
import sequelize from './sequelize.js';

export default class Raid extends Model { }

Raid.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
});


export class RaidParticipants extends Model { }

RaidParticipants.init({
  CharacterId: {
    type: DataTypes.INTEGER,
    references: {
      model: Character,
      key: 'id',
    },
  },
}, {
  sequelize,
});

Raid.belongsToMany(User, { through: RaidParticipants });
User.belongsToMany(Raid, { through: RaidParticipants });