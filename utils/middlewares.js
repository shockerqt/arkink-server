import { fetchGuildMember } from './discordBotApi.js';

export const logged = (req, res, next) => {
  const tokenData = req.session?.tokenData;

  if (tokenData) {
    next();
  } else {
    res.status(401).send({ error: 'Not logged in' });
  }
};


export const raidManager = async (req, res, next) => {
  const { guildId } = req.params;
  const { userId } = req.session;
  console.log('RAID MANAGER MIDDLEWARE');

  const guildMemberResponse = await fetchGuildMember(guildId, userId);

  if (guildMemberResponse.ok) {
    const guildMember = guildMemberResponse.data;
    console.log(guildMember);
    next();
  } else {
    const { data, status } = guildMemberResponse;
    res.status(status).send(data);
  }

};
