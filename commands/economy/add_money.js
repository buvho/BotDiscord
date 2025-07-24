const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  MessageFlags 
} = require('discord.js');
const { Users, Guilds } = require('../../dbObjects.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('add_amount')
    .setNameLocalizations({ 'pt-BR': 'adcionar_quantia' })
    .setDescription('Adds a amount of money to someone\'s account')
    .setDescriptionLocalizations({ 'pt-BR': 'Adiciona uma quantia de dinheiro à conta de alguém' })
    .addUserOption(option =>
      option
        .setName('target_user')
        .setNameLocalizations({ 'pt-BR': 'alvo' })
        .setDescription('the target user')
        .setDescriptionLocalizations({ 'pt-BR': 'usuário alvo' })
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setNameLocalizations({ 'pt-BR': 'quantia' })
        .setDescription('the amount to add')
        .setDescriptionLocalizations({ 'pt-BR': 'valor a adicionar' })
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    const isPtBR = interaction.locale === 'pt-BR';

    const targetUser = interaction.options.getUser('target_user');
    const amount = interaction.options.getInteger('amount');

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

      if (created) user.balance = guild.starting_amount;
      user.balance += amount;
      await user.save();

      return interaction.reply({
        content: isPtBR
          ? `Adicionado **${amount}** para **${member.displayName}**, agora ele tem **${user.balance} ${guild.currency_name}**.`
          : `Added **${amount}** to **${member.displayName}**, now they have **${user.balance} ${guild.currency_name}**.`
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
