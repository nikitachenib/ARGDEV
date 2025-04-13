const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Подбросить монетку (орёл или решка)')
        .addStringOption(option =>
            option.setName('выбор')
                .setDescription('Ваш выбор (орёл или решка)')
                .setRequired(false)
                .addChoices(
                    { name: 'Орёл', value: 'орёл' },
                    { name: 'Решка', value: 'решка' }
                )),

    async execute(interaction) {
        // Генерируем случайный результат (0 - орёл, 1 - решка)
        const result = Math.random() < 0.5 ? 'орёл' : 'решка';
        const userChoice = interaction.options.getString('выбор');
        
        // Создаем красивый embed
        const embed = new EmbedBuilder()
            .setTitle('🎲 Орёл или решка')
            .setColor('#FFD700')
            .setThumbnail(result === 'орёл' ? 
                'https://i.imgur.com/KY07KLe.png' : 
                'https://i.imgur.com/ZQ3Qv0P.png')
            .addFields(
                { name: 'Результат', value: `Выпало: **${result.toUpperCase()}**`, inline: true }
            );

        // Если пользователь сделал выбор
        if (userChoice) {
            const win = userChoice === result;
            embed.addFields(
                { name: 'Ваш выбор', value: `Вы выбрали: **${userChoice.toUpperCase()}**`, inline: true },
                { name: 'Результат', value: win ? '🎉 Вы выиграли!' : '😢 Вы проиграли!', inline: false }
            );
            
            // Добавляем разные цвета для победы/проигрыша
            embed.setColor(win ? '#00FF00' : '#FF0000');
        }

        await interaction.reply({ embeds: [embed] });
    },
};