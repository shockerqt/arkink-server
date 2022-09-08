import { Model, DataTypes, Op } from 'sequelize';

import sequelize from './sequelize.js';

export default class Guild extends Model {
  static async getRegisteredGuildsIds() {

  }

  static async getMyUnregisteredGuilds(userGuilds) {
    const ownedGuilds = userGuilds.reduce((array, guild) => guild.owner ? [...array, guild.id] : array, []);
    const registeredGuildsInstances = await Guild.findAll({
      attributes: ['id'],
      where: { id: { [Op.or]: ownedGuilds } },
    });
    const registeredGuilds = registeredGuildsInstances.map(guild => guild.id);
    const unregisteredGuilds = userGuilds.filter((guild) => ownedGuilds.includes(guild.id) && !registeredGuilds.includes(guild.id));
    return unregisteredGuilds;
  }

  static async getMyRegisteredGuilds(userGuilds) {
    const guildInstances = await Guild.findAll({ attributes: ['id'] });
    const guilds = guildInstances.map(guild => guild.id);
    const myRegisteredGuilds = userGuilds.filter(guild => guilds.includes(guild.id));
    return myRegisteredGuilds;
  }
}

Guild.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
}, {
  sequelize,
});
