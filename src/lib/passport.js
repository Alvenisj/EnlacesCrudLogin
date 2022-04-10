const { use } = require('passport');
const passport = require('passport'); 
const localStrategy = require('passport-local').Strategy;
const pool =  require('../database');
const helpers = require('../lib/helpers');

// PROCESA EL INICIO DE SESIÓN y recibe los datos
passport.use('local.signin', new localStrategy({

    usernameField: 'username',
    passwordFiel: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
// COMPROBAR SI SE RECIBE EL USUARIO

const row = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

if (row.length > 0) {
    const user = row[0];
    const validPassword = await helpers.matchPassword(password, user.password);
    if (validPassword){
       
        done(null, user, req.flash('success', 'Bienvenido'));
        
    } else {
        done(null, false, req.flash('message','Contraseña invalida'));
    }
} else {
    return done(null, false, req.flash('message','Nombre de usuario no existe'));
}

}));


// PROCESA EL REGISTRO DEL USUARIO
passport.use('local.signup', new localStrategy({

    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true   
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        fullname,
        username,
        password 
    };
newUser.password = await helpers.encryptPassword(password);
const result = await pool.query('INSERT INTO users SET ?', [newUser]);
newUser.id = result.insertId;
return done(null, newUser);
}));

 passport.serializeUser((user, done) => {

    done(null, user.id);
 })

 passport.deserializeUser( async (id, done) => {

  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);

 });