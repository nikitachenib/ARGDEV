const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core'); // Основной вариант
// ИЛИ используйте play-dl (альтернатива ytdl-core):
// const play = require('play-dl'); // Раскомментируйте эту строку, если используете play-dl

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Воспроизводит музыку с YouTube')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('URL YouTube видео')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const url = interaction.options.getString('url');
    const voiceChannel = interaction.member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.editReply('Вы должны быть в голосовом канале!');
    }

    try {
      // Проверка валидности URL (для ytdl-core)
      if (!ytdl.validateURL(url)) {
        return interaction.editReply('Пожалуйста, укажите корректный URL YouTube видео');
      }

      // Подключаемся к голосовому каналу
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      // Ждем готовности подключения
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

      const player = createAudioPlayer();
      connection.subscribe(player);

      // Вариант 1: Использование ytdl-core
      const streamOptions = {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25
      };
      const audioStream = ytdl(url, streamOptions);
      
      // Вариант 2: Использование play-dl (раскомментируйте, если нужно)
      // const stream = await play.stream(url);
      // const audioStream = stream.stream;

      const resource = createAudioResource(audioStream, {
        inputType: 'webm/opus',
        inlineVolume: true
      });

      player.play(resource);

      // Получаем информацию о видео (для ytdl-core)
      const info = await ytdl.getInfo(url);
      await interaction.editReply(`Сейчас играет: **${info.videoDetails.title}**`);

      player.on('error', error => {
        console.error('Player error:', error);
        connection.destroy();
      });

    } catch (error) {
      console.error('Play command error:', error);
      await interaction.editReply('Произошла ошибка при воспроизведении: ' + error.message);
    }
  }
};