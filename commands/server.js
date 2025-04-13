const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Показывает информацию о сервере'),
  
  async execute(interaction) {
    const guild = interaction.guild;
    
    const embed = new EmbedBuilder()
      .setTitle(`Информация о ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: 'Участники', value: `${guild.memberCount}`, inline: true },
        { name: 'Создан', value: guild.createdAt.toLocaleDateString(), inline: true },
        { name: 'Владелец', value: `<@${guild.ownerId}>`, inline: true }
      )
      .setColor('#ff9900');
    
    await interaction.reply({ embeds: [embed] });
  }
};