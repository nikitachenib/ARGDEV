const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');

module.exports = {
    startWebServer: (client, port) => {
        if (!client.user) {
            throw new Error('Discord client не инициализирован!');
        }

        const app = express();
        
        // Настройка шаблонизатора
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        
        // Middleware
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(session({
            secret: process.env.SESSION_SECRET || 'your-secret-key',
            resave: false,
            saveUninitialized: false
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        
        // Passport config
        passport.use(new DiscordStrategy({
            clientID: client.user.id,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL || `http://localhost:${port}/auth/discord/callback`,
            scope: ['identify', 'guilds']
        }, (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }));
        
        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((obj, done) => done(null, obj));
        
        // Маршруты
        app.use('/', require('./routes/index')(client));
        app.use('/auth', require('./routes/auth')(client)); // Передаем client если нужно
        
        // Запуск сервера
        return app.listen(port, () => {
            console.log(`Веб-панель доступна на http://localhost:${port}`);
        });
    }
};