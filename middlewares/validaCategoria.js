const { body, validationResult } = require('express-validator');

const validaCategoria = [
  body('nome')
    .notEmpty().withMessage("Nome é obrigatório")
    .isLength({ min: 2 }).withMessage("Nome precisa ter pelo menos 2 caracteres"),
  body('slug')
    .notEmpty().withMessage("Slug é obrigatório"),

  (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      const listaErros = erros.array().map(err => ({ texto: err.msg }));
      return res.render("admin/editcategorias", {
        erros: listaErros,
        categoria: {
          _id: req.body.id,
          nome: req.body.nome,
          slug: req.body.slug
        }
      });
    }
    next();
  }
];

module.exports = validaCategoria;
