const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const mysql = require('mysql');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');


// INITIALIZATION
const app = express();
require('./lib/passport');



// SETTINGS APP
app.set('port', process.env.PORT || 5000);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


// MIDDLEWARES
app.use(session({
    secret: 'alvenisj',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// GLOBAL VARIABLES
app.use((req, res, next) => {
// VARIABLES QUE PODEMOS ACCEDER DESDE CUALQUIER PARTE
app.locals.success = req.flash('success');
app.locals.message = req.flash('message');
app.locals.user = req.user;
    next();

});


// ROUTES
app.use(require('./routes/route-index'));
app.use(require('./routes/route-autentication'));
app.use('/links', require('./routes/route-links'));

// PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

// STARTING THE SERVER
app.listen(app.get('port'), () => {

    console.log('SERVER ON PORT', app.get('port'));

});