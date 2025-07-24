const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { Users, Guilds } = require('../../dbObjects.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('balance')
    .setNameLocalizations({ 'pt-BR': 'saldo' })
    .setDescription('Replies with the user\'s balance')
    .setDescriptionLocalizations({ 'pt-BR': 'Mostra o saldo do usuário' })
    .addUserOption(option =>
      option
        .setName('target_user')
        .setNameLocalizations({ 'pt-BR': 'usuario_alvo' })
        .setDescription('the target user')
        .setDescriptionLocalizations({ 'pt-BR': 'usuário alvo' })
    ),
  async execute(interaction) {
    const isPtBR = interaction.locale === 'pt-BR';

    const targetUser = interaction.options.getUser('target_user') ?? interaction.user;
    if (targetUser.bot) {
      return interaction.reply({
        content: isPtBR 
          ? 'Você não pode usar este comando em um bot.'
          : 'You cannot use this command on a bot.',
        flags: MessageFlags.Ephemeral
      });
    }

    try {
      const member = await interaction.guild.members.fetch(targetUser.id);
      const [user, created] = await Users.findOrCreate({
        where: { guild_id: interaction.guildId, user_id: targetUser.id }
      });
      const [guild] = await Guilds.findOrCreate({
        where: { guild_id: interaction.guildId }
      });

      if (created) {
        user.balance = guild.starting_amount;
        await user.save();
      }

      return interaction.reply({
        content: isPtBR
          ? `O saldo de **${member.displayName}** é **${user.balance} ${guild.currency_name}**.`
          : `The balance of **${member.displayName}** is **${user.balance} ${guild.currency_name}**.`
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: isPtBR
          ? 'O membro não está no servidor ou ocorreu um erro.'
          : 'The member is not on the server, or something went wrong.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
