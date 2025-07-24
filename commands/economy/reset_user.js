const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { Users } = require('../../dbObjects.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('reset_user')
    .setNameLocalizations({ 'pt-BR': 'resetar_usuario' })
    .setDescription('Resets user balance')
    .setDescriptionLocalizations({ 'pt-BR': 'Reseta o saldo do usuário' })
    .addUserOption(option =>
      option
        .setName('target_user')
        .setNameLocalizations({ 'pt-BR': 'usuario_alvo' })
        .setDescription('The user whose balance will be reset')
        .setDescriptionLocalizations({ 'pt-BR': 'Usuário cujo saldo será resetado' })
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const isPtBR = interaction.locale === 'pt-BR';

    const targetUser = interaction.options.getUser('target_user');

    try {
      const deletedCount = await Users.destroy({
        where: { user_id: targetUser.id, guild_id: interaction.guildId }
      });

      if (deletedCount === 0) {
        return interaction.reply({
          content: isPtBR
            ? `O usuário **${targetUser.username}** não tinha saldo registrado.`
            : `User **${targetUser.username}** had no registered balance.`,
          flags: MessageFlags.Ephemeral
        });
      }

      return interaction.reply({
        content: isPtBR
          ? `O saldo de **${targetUser.username}** foi resetado com sucesso.`
          : `The balance of **${targetUser.username}** has been successfully reset.`
      });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: isPtBR
          ? 'Ocorreu um erro ao tentar resetar o saldo.'
          : 'An error occurred while trying to reset the balance.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
};
