const path = require('path');
const config = require(path.resolve('./config.json'));
const login = `${config["Admin Dashboard Prefix"]}/login`;

module.exports = function (fastify, opts, next) {

    // Validation of a session account for each request
    fastify.addHook('preValidation', (req, res, next) => {
        let url = req.url.split("?").shift();
        url = (url.endsWith('/')) ? url.slice(0, -1) : url;
        if (url == login) return next();
        try { const session = getSession(req.cookies.session) }
        catch { res.code(301).redirect(login) }
        next();
    });

    // Including some pages route
    fastify.register(require('./plugins'), {
        prefix: '/plugins'
    }).register(require('./themes'), {
        prefix: '/themes'
    });

    // Login page
    fastify.get('/login', (req, res) => {
        res.code(200).view('./content/admin/pages/login.html');
    });

    // Logout page that will not store cache,
    // won't delete the session file!
    fastify.get('/logout', (req, res) => {
        res.headers({
			"Cache-Control": "no-store, max-age=0, must-revalidate",
			Expires: "0",
			Pragma: "no-cache",
			"Surrogate-Control": "no-store",
		});
        res.clearCookie('session', {
            path: config["Admin Dashboard Prefix"]
        });
        res.code(301).redirect(login);
    });

    // Dashboard
    fastify.get('/dashboard', (req, res) => {
        let url = (req.url.endsWith('/')) ? req.url.slice(0, -1) : req.url;
        res.view('./content/admin/html/main.html', {
            url: url.slice(10)
        });
    });
    fastify.get('', (req, res) => {
        let url = req.url;
        if (url.endsWith('/')) url = url.slice(0, -1)
        res.code(301).redirect(url + '/dashboard');
    });
    next();
}