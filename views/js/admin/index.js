const path = require('path');
const colorette = require('colorette');
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
        res.code(200).view('./content/admin/pages/login.html', {
            content: ''
        });
    });
    fastify.post('/login', (req, res) => {
        const q = req.body;
        const invalid = '<span class="error">Invalid login provided!</spam>'
        const userData = config.Users.find(user => 
            user.Email === q.email && hashPassword(user.Email, user.Password) === hashPassword(q.email, q['current-password'])
        );
        if (!userData) return res.code(401).view('./content/admin/pages/login.html', { content: invalid });
        const token = sha256(userData.Email);
        saveSession(token, { ID: userData.ID });
        res.setCookie('session', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: config["Admin Dashboard Prefix"]
        });
        fastify.log.warn(`New user has logged in as ${colorette.white(userData.Email)}! Logged IP: ${req.ip}`);
        fastify.log.warn(`If it's not you, consider deleting cache/session/ folder and changing the password in ${colorette.white('config.json')}`);
        res.code(301).redirect(config["Admin Dashboard Prefix"] + '/dashboard');
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