require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { startWebServer } = require('./web/dashboard');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Загрузка команд с обработкой ошибок
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Проверка структуры команды
    if (!command.data || !command.data.name || !command.execute) {
      console.error(`[ОШИБКА] Команда в файле ${file} имеет неправильную структуру`);
      continue;
    }
    
    client.commands.set(command.data.name, command);
    console.log(`[УСПЕХ] Команда ${command.data.name} загружена`);
  } catch (error) {
    console.error(`[ОШИБКА] Не удалось загрузить команду из файла ${file}:`, error);
  }
}

// Регистрация команд
client.once('ready', async () => {
  console.log(`Бот ${client.user.tag} готов к работе!`);
  startWebServer(client, process.env.WEB_PORT || 3000);

   try {
    // Укажите ID сервера и канала
    const guildId = '1149372430436016290';
    const channelId = '1150785801924378624';
    
    // Получаем сервер и канал
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);
    
    // Проверяем, что канал текстовый и можно отправлять сообщения
    if (channel && channel.isTextBased()) {
      await channel.send('🔔 pre-release version started! V0.9, dev: ARGNX');
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }

  try {
    console.log('Начинаю регистрацию слэш-команд...');
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    const commandsData = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
    
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsData }
    );

    console.log(`Успешно зарегистрировано ${commandsData.length} команд!`);
  } catch (error) {
    console.error('Ошибка регистрации команд:', error);
  }
});

// Обработка команд
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Команда ${interaction.commandName} не найдена`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ 
      content: 'Произошла ошибка при выполнении команды!', 
      ephemeral: true 
    });
  }
});

client.login(process.env.DISCORD_TOKEN);