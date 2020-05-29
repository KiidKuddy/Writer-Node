exports.getMyAccount = (req, res, next) => {
    res.render('my-account', {
        pageTitle: 'My account | Writer'
    });
};