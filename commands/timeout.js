const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Замутить участника')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Кого мутим?')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('На сколько минут?')
                .setMinValue(1)
                .setMaxValue(40320) // 28 дней максимум
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Причина'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const minutes = interaction.options.getInteger('minutes');
        const reason = interaction.options.getString('reason') || 'Без причины';

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ content: '**❌ У тебя нет прав на таймаут!**', ephemeral: true });
        }

        const member = await interaction.guild.members.fetch(user.id);
        await member.timeout(minutes * 60 * 1000, reason); // Конвертируем минуты в мс

        await interaction.reply({ content: `**⏳ ${user.tag} замьючен на ${minutes} минут!** Причина: ${reason}` });
    }
};