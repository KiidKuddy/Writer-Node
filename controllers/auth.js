const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.loggedIn);
    res.render('login', {
        pageTitle: 'Create an account / Login | Writer',
        invalidEmailMessage: req.flash('invalidEmail'),
        invalidPasswordMessage: req.flash('invalidPassword'),
        passwordsDontMatchMessage: req.flash('passwordsDontMath')
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('invalidEmail', 'Invalid email address or password');
                return;
            }

            bcrypt
                .compare(password, user.password)
                .then(passwordsMatch => {
                    if (passwordsMatch) {
                        req.session.user = user;
                        req.session.loggedIn = true;
                        return req.session.save(error => {
                            console.log(error);
                            res.redirect('/login');
                        });
                    }
                    req.flash('invalidEmail', 'Invalid email address or password');
                    res.redirect('/login');
                })
                .catch(error => {
                    console.log(error);
                    res.redirect('/login');
                });
        })
        .catch(error => console.log(error));
};

exports.postRegister = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty) {
        res.status(422).render('login', {
            pageTitle: 'Create an account / Login | Writer',
            invalidEmailMessage: req.flash('invalidEmail'),
            invalidPasswordMessage: req.flash('invalidPassword'),
            passwordsDontMatchMessage: req.flash('passwordsDontMath')
        });
    }

    User.findOne({ email: email })
        .then(emailExists => {
            if (emailExists) {
                req.flash('invalidEmail', 'Email address already exists');
                return;
            }

            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword
                    });
                    return user.save().then(r => console.log('User created'));
                });
        })
        .catch(error => console.log(error));

    res.redirect('/login');
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(error => {
        console.log(error);
    });
    res.redirect('/login');
};