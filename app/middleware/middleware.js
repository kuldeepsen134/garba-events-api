const { Session } = require('../models');

module.exports = middleware = async (req, res, next) => {
    if (req.path.includes('login') || req.path.includes('password') || req.path.includes('users')) return next();

    if (req.headers.authorization) {
        let access_token = req.headers.authorization;
        const session = await Session.findOne({ where: { access_token: access_token } });
        if (session) { return next(); }
    }
    res.status(401).send({
        error: true,
        message: 'Unauthorized access!'
    });
};  