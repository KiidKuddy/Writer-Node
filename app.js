const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const User = require('./models/user');

//const MONGODB_URI = 'mongodb://localhost/bookstore';
const MONGODB_URI = 'mongodb+srv://edimenboss:TZizoUIRLqz0ZNBc@cluster0-kvomi.mongodb.net/bookstore'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.engine('hbs', expressHbs({ defaultLayout: 'main-layout', extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'SOwhN1@xFCgGd5DIuZmFc#E5Qo&T%8^PoE2F747#cSpEt!L!1P%wnPLccCKGI#M5zz4Ig5$0Z@qSJ69dZWSwK1!gpuoEH@zefpD',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => console.log(error));
});

app.use((req, res, next) => {
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(authRoutes);
app.use(userRoutes);

app.get('/', (req, res, next) => {
    res.render('index', {
        pageTitle: 'Home | Writer',
        loggedIn: req.session.loggedIn
    });
});

app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: '404 Page not Found | Writer',
        loggedIn: req.session.loggedIn
    });
});

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => app.listen(3000))
    .catch(error => console.log(error));
