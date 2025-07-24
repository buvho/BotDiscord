const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { Guilds } = require('../../dbObjects.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('currency_name')
    .setNameLocalizations({ 'pt-BR': 'nome_moeda' })
    .setDescription('Replies or updates the name of the currency')
    .setDescriptionLocalizations({ 'pt-BR': 'Mostra ou altera o nome da moeda do servidor' })
    .addStringOption(option =>
      option
        .setName('new_name')
        .setNameLocalizations({ 'pt-BR': 'novo_nome' })
        .setDescription('The new name of the currency')
        .setDescriptionLocalizations({ 'pt-BR': 'O novo nome da moeda' })
    ),

  async execute(interaction) {
    const isPtBR = interaction.locale === 'pt-BR';

    const newName = interaction.options.getString('new_name');
    const [guild] = await Guilds.findOrCreate({ where: { guild_id: interaction.guildId } });
    
    // Atualiza o nome da moeda se fornecido e usuário for admin
    if (newName) {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
          content: isPtBR
            ? 'Você não tem permissão suficiente para fazer isso!'
            : 'You dont have enough permissions to do this!',
          flags: MessageFlags.Ephemeral
        });
      }

      guild.currency_name = newName;
      await guild.save();

      return interaction.reply({
        content: isPtBR
          ? `O nome da moeda do servidor foi alterado para **${guild.currency_name}**.`
          : `The server's currency name was changed to **${guild.currency_name}**.`
      });
    }

    // Apenas retorna o nome da moeda atual
    return interaction.reply({
      content: isPtBR
        ? `O nome da moeda deste servidor é **${guild.currency_name}**.`
        : `This server's currency name is **${guild.currency_name}**.`
    });
  }
};
