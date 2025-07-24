const { MessageFlags, SlashCommandBuilder } = require('discord.js');
const { Users, Guilds } = require('../../dbObjects.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('pay')
    .setNameLocalizations({ 'pt-BR': 'pagar' })
    .setDescription('Give an amount of money to someone')
    .setDescriptionLocalizations({ 'pt-BR': 'Dá uma quantia de dinheiro para alguém' })
    .addUserOption(option =>
      option
        .setName('target_user')
        .setNameLocalizations({ 'pt-BR': 'usuario_alvo' })
        .setDescription('The user to receive the money')
        .setDescriptionLocalizations({ 'pt-BR': 'Usuário que vai receber o dinheiro' })
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setNameLocalizations({ 'pt-BR': 'quantia' })
        .setDescription('The amount to give')
        .setDescriptionLocalizations({ 'pt-BR': 'A quantia a ser dada' })
        .setRequired(true)
    ),

  async execute(interaction) {
    const isPtBR = interaction.locale === 'pt-BR';

    const targetUser = interaction.options.getUser('target_user');
    const amount = interaction.options.getInteger('amount');

    if (amount <= 0) {
        return interaction.reply({
        content: isPtBR
          ? 'Insira um numero maior que zero!'
          : 'insert a number bigger than zero!',
        flags: MessageFlags.Ephemeral
      });
    }
    
    if (targetUser.id === interaction.user.id) {
      return interaction.reply({
        content: isPtBR
          ? 'Você não pode transferir dinheiro para si mesmo!'
          : 'You cant give money to yourself!',
        flags: MessageFlags.Ephemeral
      });
    }

    if (targetUser.bot) {
      return interaction.reply({
        content: isPtBR
          ? 'Você não pode usar esse comando em um bot.'
          : 'You cannot use this command on a bot.',
        flags: MessageFlags.Ephemeral
      });
    }

    try {
      const member = await interaction.guild.members.fetch(targetUser.id);

      const [user, created] = await Users.findOrCreate({
        where: { guild_id: interaction.guildId, user_id: interaction.user.id }
      });
      const [user2, created2] = await Users.findOrCreate({
        where: { guild_id: interaction.guildId, user_id: targetUser.id }
      });
      const [guild] = await Guilds.findOrCreate({
        where: { guild_id: interaction.guildId }
      });

      if (created) user.balance = guild.starting_amount;
      if (created2) user2.balance = guild.starting_amount;

      if (user.balance < amount) {
        return interaction.reply({
          content: isPtBR
            ? `Você não tem ${guild.currency_name} suficiente para fazer isso.`
            : `You dont have enough ${guild.currency_name} to give.`,
          flags: MessageFlags.Ephemeral
        });
      }

      user.balance -= amount;
      user2.balance += amount;

      await user.save();
      await user2.save();

      return interaction.reply({
        content: isPtBR
          ? `Você deu **${amount} ${guild.currency_name}** para **${member.displayName}**. Agora ele tem **${user2.balance} ${guild.currency_name}**.`
          : `You gave **${amount} ${guild.currency_name}** to **${member.displayName}**. They now have **${user2.balance} ${guild.currency_name}**.`
      });

    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: isPtBR
          ? 'O membro não está no servidor ou ocorreu algum erro.'
          : 'The member is not on the server, or something went wrong.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
