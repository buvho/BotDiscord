const { SlashCommandBuilder, MessageFlags, codeBlock} = require('discord.js');
const { Users } = require('../../dbObjects.js');
const Balance = require('./Balance.js');

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Replies with the money rank of the server')
    .setDescriptionLocalizations({ 'pt-BR': 'Mostra o rank monetario do server' }),
  async execute(interaction) {
    const isPtBR = interaction.locale === 'pt-BR';

    let storedUsers = await Users.findAll({where: {guild_id: interaction.guildId}})
    if (storedUsers.length === 0){
      return interaction.reply({content: isPtBR ? 'nenhum membro interagiu com a economia ainda' : 'no member have interacted with the economy yet',
      flags: MessageFlags.Ephemeral
      })
    }
    storedUsers.sort((a,b) => b.balance - a.balance)
    storedUsers = storedUsers.slice(0,10)
    
    const usersinfo =  await Promise.all(storedUsers.map(async (user) =>{
      let discorduser = interaction.client.users.cache.get(user.user_id)
      if (!discorduser){
        try{
          discorduser = await interaction.client.users.fetch(user.user_id)
        }catch{
          return {name: "error", balance: user.balance}
        }
      }
      return {name: discorduser.displayName, balance: user.balance}
    }))
    const leaderboard = usersinfo.map((u, i) => `(${i + 1}) ${u.name}: ${u.balance}💰`);
    return interaction.reply(codeBlock(leaderboard.join('\n')))
  }
};
