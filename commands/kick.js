const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Выгнать участника')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Кого выгоняем?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Причина кика'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Без причины';

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: '**❌ У тебя нет прав на кик!**', ephemeral: true });
        }

        await interaction.guild.members.kick(user, { reason });
        await interaction.reply({ content: `**🦶 ${user.tag} выгнан!** Причина: ${reason}` });
    }
};