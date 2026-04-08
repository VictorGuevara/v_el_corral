module.exports = {
  // Función para saber si se logueo correctamente.
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/signin');
  },

  // Función para saber si esta logueado.
  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
  },

  // Validación flexible por ciudad o rol
  authCiudad(ciudadesPermitidas) {
    return (req, res, next) => {
      // Si ciudadesPermitidas es string, lo convertimos en array
      const permitidos = Array.isArray(ciudadesPermitidas) ? ciudadesPermitidas : [ciudadesPermitidas];

      if (!permitidos.includes(req.user.cargo)) {
        return res.redirect('/logout');
      }

      return next();
    };
  },
};
