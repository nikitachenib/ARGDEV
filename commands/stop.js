const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Остановить воспроизведение музыки'),

    async execute(interaction) {
        const player = players.get(interaction.guild.id);
        
        if (!player) {
            return interaction.reply('❌ Нет активного воспроизведения!');
        }

        player.stop();
        players.delete(interaction.guild.id);
        
        const connection = getVoiceConnection(interaction.guild.id);
        if (connection) connection.destroy();
        
        await interaction.reply('⏹️ Воспроизведение остановлено!');
    },
};