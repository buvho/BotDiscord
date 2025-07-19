const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('change a users nickname')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('a vitima')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('nickname')
				.setDescription('o novo apelido')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
	async execute(interaction) {
		const targetUser = interaction.options.getUser('user');
		const nickname = interaction.options.getString('nickname');

		const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

		if (!member) {
			await interaction.reply({ content: 'O usuario nao foi encontrado no server', flags: MessageFlags.Ephemeral });
		}
		else if (!member.manageable) {
			await interaction.reply({ content: 'Usuario muito poderoso para ser modificado', flags: MessageFlags.Ephemeral });
		}
		else {
			await member.setNickname(nickname);
			await interaction.reply({ content: `O nome do usuário ${member.nickname} foi modificado para ${nickname}`, flags: MessageFlags.Ephemeral });
		}
	},
};
