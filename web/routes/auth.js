const express = require('express');
const router = express.Router();
const passport = require('passport');

module.exports = (client) => {
    // Страница входа
    router.get('/login', (req, res) => {
        try {
            res.render('login', { 
                title: 'Вход через Discord',
                authUrl: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&redirect_uri=${encodeURIComponent(process.env.CALLBACK_URL)}&response_type=code&scope=identify%20guilds`
            });
        } catch (error) {
            console.error('Ошибка рендеринга login:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Обработка callback от Discord
    router.get('/discord/callback', passport.authenticate('discord', {
        failureRedirect: '/auth/login',
        successRedirect: '/'
    }));

    // Выход
    router.get('/logout', (req, res) => {
        req.logout(() => {
            res.redirect('/');
        });
    });

    return router;
};