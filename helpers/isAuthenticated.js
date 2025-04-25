module.exports = {
    estaLogado: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash("error_msg", "Você precisa estar logado para ver esta página.");
      res.redirect("/usuarios/login");
    }
  };
  