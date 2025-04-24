// importando modules
    const express = require('express');
    const handlebars = require('express-handlebars')
    const app = express()
    const admin = require("./routes/admin")
    const bodyParser = require("body-parser")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
    const Handlebars = require('handlebars')
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuario = require('./routes/usuario')
    const passport = require("passport")
    require("./config/auth")(passport)
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))

// config
    // sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    // Middleware  
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next()
        })
    //Body Parser
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    // handlebars
    app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        helpers: {
            formatDateTime: function (date) {
                if (!date) return '';
                return new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date);
            }
        }
    }))
    
    app.set('view engine', 'handlebars')
    //Mongoose
    mongoose.connect("mongodb://mongo-db:27017/blogapp")
  .then(() => {
    console.log('Conectado ao mongo');
  })
  .catch((err) => {
    console.log('Erro ao se conectar: ' + err);
  });
    // public
     //app.set('views', path.join(__dirname, 'views'));
     app.use(express.static(path.join(__dirname,'public')));

     app.use((req, res, next)=>{
            console.log('eu sou um middleware');
            next()
     })
// Rotas
app.get('/',(req, res) => {
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render("index", { postagens: postagens }) 
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro interno!")
    })
})

app.get("/postagem/:slug", (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
        if(postagem){
            res.render("postagem/index", {postagem: postagem})
        }else{
            req.flash("error_msg", "Essa Postagem não existe!")
            res.redirect("/")
        }
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro interno!")
        res.redirect("/")
    })
})
app.get("/categorias", (req, res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("categorias/index", {categorias: categorias})    
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao listar a Categoria")
            res.redirect("/")
        })
    })

app.get("/categorias/:slug", (req, res)=>{
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
                res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
            }).catch((err)=>{
                req.flash("error_msg","Houve um erro ao listar os posts!")
                res.redirect("/")
            })
        }

    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar a pagina dessa categoria")
        res.redirect("/")
    })
})    

app.get("/404", (req, res)=>{
    res.send("Erro 404!")
})
    app.use('/admin', admin)
    app.use('/usuarios', usuario)
// outros
const PORT = 8081
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na URL: http://0.0.0.0:${PORT}`);
});

