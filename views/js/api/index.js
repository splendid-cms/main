const config = require(require('path').resolve('./config.json'));

module.exports = function (fastify, opts, next) {

    // Removing cache control for each request
    fastify.addHook("onRequest", async (req, res) => {
		res.headers({
			"Cache-Control": "no-store, max-age=0, must-revalidate",
			Expires: "0",
			Pragma: "no-cache",
			"Surrogate-Control": "no-store",
		});
	});
    fastify.get('/auth', (req, res) => {
        const q = req.query;
        const userData = config.Users.find(user => user.Email === q.email && hashPassword(user.Email, user.Password) === hashPassword(q.email, q.password));
        if (!userData) return res.code(403).send({ statusCode: '403' })
        const token = sha256(userData.Email);
        saveSession(token, { ID: userData.ID });
        res.setCookie('session', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: config["Admin Dashboard Prefix"]
        });
        fastify.log.warn('New account has logged in! Creating new session.')
        res.code(301).redirect(config["Admin Dashboard Prefix"] + '/dashboard');
    });
    next();
}