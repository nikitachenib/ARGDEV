const {SlashCommandBuilder, EmbedBuilder} = require ('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('подсказки по командам'),

    async execute(interaction){
        const embed = new EmbedBuilder()
            .setColor('LuminousVividPink')
            .setTitle('*/help*')
            .addFields(
            { name: '*/play [ссылка на видео Youtube]*', value: ' - воспроизведение музыки в голосовом канале', inline: true },
            { name: '*/stop*', value: ' - остановить воспроизведение', inline: true },
            { name: '*/server*', value: ' - информация о сервере', inline: true },
            { name: '*/user @username*', value: ' - информация о пользователе', inline: true },
            { name: '*/ping*', value: ' - показывает пинг бота (изначально добавлена для теста)', inline: true },
            { name: '*/coinflip - [ваш выбор]*', value: ' - игра "Орёл и Решка"', inline: true }
            )
            .setThumbnail('https://imgur.com/a/ExuFmEr');


            await interaction.reply({ embeds: [embed]});
    }

}