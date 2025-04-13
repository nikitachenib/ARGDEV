const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

// Хранилище аудиоплееров для каждого сервера
const players = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Воспроизвести музыку с YouTube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Ссылка на YouTube видео')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.editReply('❌ Вы должны быть в голосовом канале!');
        }

        const url = interaction.options.getString('url');
        if (!ytdl.validateURL(url)) {
            return interaction.editReply('❌ Пожалуйста, укажите корректную ссылку на YouTube видео!');
        }

        try {
            // Создаем подключение к голосовому каналу
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Создаем или получаем плеер для этого сервера
            let player = players.get(interaction.guild.id);
            if (!player) {
                player = createAudioPlayer();
                players.set(interaction.guild.id, player);
                
                player.on(AudioPlayerStatus.Idle, () => {
                    connection.destroy();
                    players.delete(interaction.guild.id);
                });
            }

            connection.subscribe(player);

            // Создаем аудиоресурс из YouTube ссылки
            const stream = ytdl(url, { 
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25 
            });

            const resource = createAudioResource(stream);
            player.play(resource);

            await interaction.editReply(`🎵 Воспроизвожу: ${url}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Произошла ошибка при воспроизведении!');
        }
    },
};