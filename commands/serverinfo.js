const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Показать статистику сервера'),
    
    async execute(interaction) {
        const guild = interaction.guild;
        
        // Получаем данные о сервере
        const members = await guild.members.fetch();
        const onlineMembers = members.filter(m => m.presence?.status === 'online').size;
        const bots = members.filter(m => m.user.bot).size;
        
        // Создаем embed
        const embed = new EmbedBuilder()
            .setColor('#4b0082')
            .setAuthor({ 
                name: `Статистика сервера ${guild.name}`, 
                iconURL: guild.iconURL() 
            })
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .addFields(
                { name: '👑 Владелец', value: `<@${guild.ownerId}>`, inline: true },
                { name: '📅 Создан', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                { name: '👥 Участники', value: `Всего: ${guild.memberCount}\nЛюдей: ${guild.memberCount - bots}\nБотов: ${bots}\nОнлайн: ${onlineMembers}`, inline: true },
                { name: '📊 Каналы', value: `Текстовые: ${guild.channels.cache.filter(c => c.isTextBased()).size}\nГолосовые: ${guild.channels.cache.filter(c => c.isVoiceBased()).size}`, inline: true },
                { name: '🎭 Роли', value: `${guild.roles.cache.size}`, inline: true },
                { name: '🚀 Бусты', value: `Уровень: ${guild.premiumTier}\nКоличество: ${guild.premiumSubscriptionCount || 0}`, inline: true }
            )
            .setFooter({ 
                text: `ID сервера: ${guild.id}` 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};