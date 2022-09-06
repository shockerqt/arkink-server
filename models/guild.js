import { Model, DataTypes, Op } from 'sequelize';

import { fetchUserGuilds } from '../utils/discord.js';
import { sequelize } from './init.js';

export default class Guild extends Model {
  static async getUnregisteredGuilds(tokenData) {
    const guilds = await fetchUserGuilds(tokenData);

    const ownedGuilds = guilds.reduce((array, guild) => guild.owner ? [...array, guild.id] : array, []);
    const registeredGuildsInstances = await Guild.findAll({
      attributes: ['id'],
      where: { id: { [Op.or]: ownedGuilds } },
    });

    const registeredGuilds = registeredGuildsInstances.map(guild => guild.id);

    const unregisteredGuilds = guilds.filter((guild) => ownedGuilds.includes(guild.id) && !registeredGuilds.includes(guild.id));

    // console.log('OWNED', ownedGuilds)
    // console.log('REGISTERED', registeredGuilds)
    // console.log('UNREGISTERED', unregisteredGuilds)

    return unregisteredGuilds;
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
