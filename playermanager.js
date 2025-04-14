// playerManager.js
const { Collection } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

class PlayerManager {
    constructor() {
        this.players = new Collection();
    }

    get(guildId) {
        return this.players.get(guildId);
    }

    set(guildId, player) {
        this.players.set(guildId, player);
    }

    delete(guildId) {
        const player = this.players.get(guildId);
        if (player) {
            player.stop();
            const connection = getVoiceConnection(guildId);
            if (connection) connection.destroy();
            this.players.delete(guildId);
        }
    }
}

module.exports = new PlayerManager();