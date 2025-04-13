const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Показывает информацию о пользователе')
    .addUserOption(option =>
      option.setName('пользователь')
        .setDescription('Пользователь, о котором нужно получить информацию')
        .setRequired(false)),
  
  async execute(interaction) {
    const user = interaction.options.getUser('пользователь') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    
    const embed = new EmbedBuilder()
      .setTitle(`Информация о ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Аккаунт создан', value: user.createdAt.toLocaleDateString(), inline: true },
        { name: 'На сервере с', value: member?.joinedAt.toLocaleDateString() || 'Неизвестно', inline: true }
      )
      .setColor('#00ff99');
    
    await interaction.reply({ embeds: [embed] });
  }
};