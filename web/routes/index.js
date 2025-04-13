const express = require('express');
const os = require('os');
const process = require('process');
const router = express.Router(); // Добавьте эту строку

module.exports = (client) => {
    // API для статистики
    router.get('/api/stats', (req, res) => {
        const stats = {
            cpu: {
                load: (os.loadavg()[0] / os.cpus().length * 100).toFixed(2),
                cores: os.cpus().length
            },
            ram: {
                total: Math.round(os.totalmem() / 1024 / 1024),
                used: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024),
                free: Math.round(os.freemem() / 1024 / 1024)
            },
            uptime: process.uptime(),
            bot: {
                guilds: client.guilds.cache.size,
                users: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
                commands: client.commands.size
            }
        };
        res.json(stats);
    });

    // Главная страница
    router.get('/', (req, res) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/auth/login');
        }

        res.render('index', {
            user: req.user,
            bot: client.user,
            guilds: client.guilds.cache,
            stats: {
                cpu: os.loadavg()[0],
                memory: process.memoryUsage(),
                uptime: process.uptime()
            }
        });
    });

    return router;
};