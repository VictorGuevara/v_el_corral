/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                               IMPORTACIONES                                */
/*                                                                            */
/* -------------------------------------------------------------------------- */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn, authCiudad } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                                   RUTAS                                    */
/*                                                                            */
/* -------------------------------------------------------------------------- */

// Ruta para renderizar la vista de registro...
router.get('/admin/signup', isLoggedIn, (req, res) => {
	res.render('admin/signup');
});

// Ruta para renderizar la vista de registro...
router.get('/signin', isNotLoggedIn, (req, res) => {
	res.render('auth/signin');
});

// Ruta para realizar acciones al ingresar como usuario.
router.post('/signin', isNotLoggedIn, (req, res, next) => {
	passport.authenticate('local.signin', {
		successRedirect: '/directorie_used',
		failureRedirect: '/signin',
		failureFlash: true,
	})(req, res, next);
});

// Ruta para redireccionar si es administrador o otro tipo de usuario.
router.get('/directorie_used', isLoggedIn, (req, res) => {
	if (req.user.cargo == 'Administrador' && req.user.sucursal_user == 'Santa Isabel') {
		res.redirect('/admin/');
	} else if (req.user.cargo == 'Contador' && req.user.sucursal_user == 'Santa Isabel') {
		res.redirect('/reg_facturas/');
	}
});

// Ruta para renderizar la vista despues del registro...
router.get('/profile', isLoggedIn, authCiudad('Santa Isabel'), (req, res) => {
	res.render('profile');
});

// Ruta para cerrar la session.
router.get('/logout', isLoggedIn, (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/signin');
	});
});

/* -------------------------------------------------------------------------- */
/*                                                                            */
/*                               EXPORTACIONES                                */
/*                                                                            */
/* -------------------------------------------------------------------------- */

module.exports = router;
