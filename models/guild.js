import { Model, DataTypes } from 'sequelize';

import { sequelize } from './init.js';
import User from './user.js';

export default class Guild extends Model {}

Guild.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  guildname: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  invite: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
});

export class GuildMembers extends Model {}

GuildMembers.init({
  role: {
    type: DataTypes.STRING,
    defaultValue: 'member',
  }
}, {
  sequelize,
});

Guild.belongsToMany(User, { through: GuildMembers });
User.belongsToMany(Guild, { through: GuildMembers });
