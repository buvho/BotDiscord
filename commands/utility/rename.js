const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('rename')
    .setNameLocalizations({ 'pt-BR': 'renomear' })

    .setDescription('Change a users nickname')
    .setDescriptionLocalizations({ 'pt-BR': 'Altera o apelido de um usuário' })
    .addUserOption(option =>
      option
        .setName('user')
        .setNameLocalizations({ 'pt-BR': 'usuario' })
        .setDescription('The vitmin')
        .setDescriptionLocalizations({ 'pt-BR': 'A vitima' })
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('nickname')
        .setNameLocalizations({ 'pt-BR': 'apelido' })
        .setDescription('The new nickname')
        .setDescriptionLocalizations({ 'pt-BR': 'O novo apelido' })
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async execute(interaction) {
    const locale = interaction.locale;
    const isPtBR = locale === 'pt-BR';

    const targetUser = interaction.options.getUser('user');
    const nickname = interaction.options.getString('nickname');

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: isPtBR
          ? 'O usuário não pôde ser encontrado no servidor.'
          : 'The user cannot be found in the server.',
        flags: MessageFlags.Ephemeral
      });
    }

    if (!member.manageable) {
      return interaction.reply({
        content: isPtBR
          ? 'O usuario tem sucesso demais'
          : 'the user is to powerful',
        flags: MessageFlags.Ephemeral
      });
    }

    await member.setNickname(nickname);

    return interaction.reply({
      content: isPtBR
        ? `O apelido de **${member.user.username}** foi alterado para **${nickname}**.`
        : `The nickname of **${member.user.username}** was changed to **${nickname}**.`,
      flags: MessageFlags.Ephemeral
    });
  },
};
