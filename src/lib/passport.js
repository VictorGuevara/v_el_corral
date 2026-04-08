const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

// Ruta para loguearce.
passport.use('local.signin', new LocalStrategy({
    usernameField: 'user_name',
    passwordField: 'user_pass',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPass = await helpers.mathPassword(password, user.password);
        if (validPass) {
            done(null, user);
        } else {
            done(null, false, req.flash('msm', 'Contraseña invalida'));
        }
    } else {
        return done(null, false, req.flash('msm', 'Usuario No existe'));
    }
}));

// Ruta para seliarizar.
passport.serializeUser((user, done) => {
    done(null, user.cod_users);
});

// Ruta para deserializar.
passport.deserializeUser(async (id, done) => {
    const filas = await pool.query('SELECT * FROM users WHERE cod_users = ?', [id]);
    done(null, filas[0]);
});
