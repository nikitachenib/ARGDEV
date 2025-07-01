const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Забанить участника')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Кого баним?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Причина бана'))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Удалить сообщения за последние N дней')
                .setMinValue(0)
                .setMaxValue(7))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Без причины';
        const days = interaction.options.getInteger('days') || 0;

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: '**❌ У тебя нет прав на бан!**', ephemeral: true });
        }

        await interaction.guild.members.ban(user, { reason, deleteMessageDays: days });
        await interaction.reply({ content: `**🔨 ${user.tag} забанен!** Причина: ${reason}` });
    }
};