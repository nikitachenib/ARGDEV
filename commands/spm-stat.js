const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { status } = require('minecraft-server-util');
require('dotenv').config(); // Чтобы .env работал и здесь (на всякий)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spm-stats')
        .setDescription('статус SPM'),
    
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const serverIP = process.env.SPM_SERVER_IP;
            const serverPort = parseInt(process.env.SERVER_PORT) || 25565;

            const res = await status(serverIP, { port: serverPort });

            const embed = new EmbedBuilder()
                .setTitle(`🟢 Статус сервера ${serverIP}`)
                .setColor('#2ecc71')
                .addFields(
                    { name: '👥 Онлайн', value: `**${res.players.online}/${res.players.max}**`, inline: true },
                    { name: '🔧 Версия', value: res.version.name, inline: true },
                    { name: '📜 MOTD', value: res.motd.clean || '—' }
                )
                .setFooter({ text: `Запрошено ${new Date().toLocaleString()}` });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('Ошибка при получении данных от сервера / не удаётся подключиться к IP');
            console.error(error);
            console.error("IP не читается || не тот IP")
        }
    }
}; 