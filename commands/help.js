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
            { name: '*/coinflip  [ваш выбор]*', value: ' - игра "Орёл и Решка"', inline: true },
            { name: '*/kick [участник] [причина]*', value: 'кикает участника', inline: true },
            { name: '*/ban [участника] [причина]*', value: 'банит участника на сервере', inline: true },
            { name: '*/timeout [участник] [причина] [время]*', value: 'мутит участника на определённое время', inline: true },
            { name: '**SUPPORT**', value: 't.me/argnxstd/', inline: true }

            )
            .setFooter({ 
                text: 'EXPEREMENTAL MODE',
                iconURL: 'https://i.imgur.com/AfFp7pu.png'
            })
.setTimestamp() // добавит текущее время внизу embed


            await interaction.reply({ embeds: [embed]});
    }

}