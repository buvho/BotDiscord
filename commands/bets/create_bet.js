/* const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { Users, Guilds, Bets, BetOptions } = require('../../dbObjects.js');
const bets = require('../../models/bets.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('create_bet')
    .setNameLocalizations({ 'pt-BR': 'criar_aposta' })
    .setDescription('Create a bet with custom options, /finalize_bet to decide a winner')
    .setDescriptionLocalizations({ 'pt-BR': 'Cria uma aposta com opções customizadas, de /finalizar_bet para decidir um ganhador' })
    .addStringOption(option =>
      option
        .setName('title')
        .setNameLocalizations({ 'pt-BR': 'titulo' })
        .setDescription('the bet`s title ')
        .setDescriptionLocalizations({ 'pt-BR': 'o titulo da aposta' })
    )
    .addIntegerOption(option => 
        option)
            .setName('value')
            .setNameLocalizations({ 'pt-BR': 'valor' })
            .setDescription('the bet value')
            .setDescriptionLocalizations(('valor para entrar na aposta'))
    .addStringOption(option =>
      option
        .setName('options')
        .setNameLocalizations({ 'pt-BR': 'opções' })
        .setDescription('each option needs to be separeated by `|`, example: " win | draw | lose " ')
        .setDescriptionLocalizations({ 'pt-BR': 'cada opção deve ser separada por `|`, exemplo: "vencer | empatar | perder "' })
    ),
  async execute(interaction) {
    const isPtBR = interaction.locale === 'pt-BR';
    const targetUser = interaction.options.getUser('target_user') ?? interaction.user;
    
    const title = interaction.option.getString('title')
    const valor = interaction.option.getInteger('amount')
    const options = interaction.option.getString('options').split("|")

    if (options.length < 2){
        return interaction.reply({
            content: isPtBR
            ? 'Não há opções suficientes, para separar as opções utilize o caractere |, ex: "ele vai ganhar | ele vai perder | ele vai empatar"'
            : 'Não há opções suficientes, para separar as opções utilize o caractere |, ex: "ele vai ganhar | ele vai perder | ele vai empatar"',
            flags: MessageFlags.Ephemeral
      });
    }
    
    if (options.length > 10){
        return interaction.reply({
            content: isPtBR
            ? 'O limite de opções apostas é 10'
            : 'O limite de opções apostas é 10',
            flags: MessageFlags.Ephemeral
      });
    }

    try {
        await Bets.Cre
    } catch (err) {
      return interaction.reply({
        content: isPtBR
          ? 'ocorreu um erro.'
          : 'something went wrong.',
        flags: MessageFlags.Ephemeral
      });
    }
  }
}; */