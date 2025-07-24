const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { Guilds } = require('../../dbObjects.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('starting_amount')
    .setNameLocalizations({ 'pt-BR': 'quantia_inicial' })
    .setDescription('Replies or updates the starting balance for new users')
    .setDescriptionLocalizations({ 'pt-BR': 'Mostra ou atualiza a quantia inicial de saldo para novos usuários' })
    .addIntegerOption(option =>
      option
        .setName('amount')
        .setNameLocalizations({ 'pt-BR': 'quantia' })
        .setDescription('The new starting amount')
        .setDescriptionLocalizations({ 'pt-BR': 'A nova quantia inicial' })
    ),

  async execute(interaction) {
    const isPtBR = interaction.locale === 'pt-BR';

    const amount = interaction.options.getInteger('amount');
    const [guild] = await Guilds.findOrCreate({
      where: { guild_id: interaction.guildId }
    });

    if (amount !== null) {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
          content: isPtBR
            ? 'Você não tem permissão suficiente para fazer isso!'
            : 'You dont have enough permissions to do this!',
          flags: MessageFlags.Ephemeral
        });
      }

      if (amount < 0) {
        return interaction.reply({
          content: isPtBR
            ? 'A quantia inicial não pode ser negativa.'
            : 'Starting amount cannot be negative.',
          flags: MessageFlags.Ephemeral
        });
      }

      guild.starting_amount = amount;
      await guild.save();

      return interaction.reply({
        content: isPtBR
          ? `A quantia inicial agora é **${guild.starting_amount}**.`
          : `The starting amount is now **${guild.starting_amount}**.`
      });
    }

    // Exibir valor atual
    return interaction.reply({
      content: isPtBR
        ? `A quantia inicial deste servidor é **${guild.starting_amount}**.`
        : `This server's starting amount is **${guild.starting_amount}**.`
    });
  }
};
