const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const cors = require('cors');

const { database } = require('./keys');

// Initializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine(
	'.hbs',
	exphbs.engine({
		defaultLayout: 'main',
		layoutsDir: path.join(app.get('views'), 'layouts'),
		partialsDir: path.join(app.get('views'), 'partials'),
		extname: '.hbs',
		helpers: require('./lib/handlebars'),
	})
);
app.set('view engine', '.hbs');

// Middlewares
app.use(
	session({
		secret: 'fspg01session',
		rasave: true,
		saveUninitialized: true,
		store: new MySQLStore(database),
	})
);

// Creamos una lista blanca para control de accesos...
const lista_blanca = ['https://ejemplo.com'];

app.use(cors({ origin: lista_blanca, methods: 'POST' }));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
	app.locals.msmsuccess = req.flash('msmsuccess');
	app.locals.msm = req.flash('msm');
	app.locals.user = req.user;
	next();
});

// Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/autentication.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/menu', require('./routes/menu.routes'));
app.use('/usuarios', require('./routes/usuarios.routes'));
app.use('/expedientes', require('./routes/expedientes.routes'));
app.use('/reg_citas', require('./routes/citas.routes'));
app.use('/notificar_citas', require('./routes/notificar_citas.routes'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting The Server
app.listen(app.get('port'), '0.0.0.0', () => {
	console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});
