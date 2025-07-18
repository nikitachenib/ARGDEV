require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// Загрузка команд
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Регистрация команд
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Начинаю регистрацию слэш-команд...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [...client.commands.values()].map(cmd => cmd.data.toJSON()) }
    );

    console.log('Слэш-команды успешно зарегистрированы!');
  } catch (error) {
    console.error('Ошибка регистрации команд:', error);
  }
})();

// Обработка команд
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

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

// Запуск бота
client.login(process.env.DISCORD_TOKEN);