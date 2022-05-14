const path = require('path');
const config = require(path.resolve("./config.json"));
const icon = path.join(path.resolve('./content/media'), config.Icon);
// const Logger = (config.Debug) ? new require('./logger.js') : false ;
const Logger = require('./logger');
const fastify = require('fastify')({
    logger: new Logger,
    ignoreTrailingSlash: true
});
const fs = require('fs');

// Adding additional functions
require('./functions/additional');

// Overwriting all additional functions
// with built-in functions
require('./functions/built-in');


// MIDDLEWARE

// Used for EJS support
fastify.register(require("point-of-view"), {
    engine: { ejs: require("ejs") },
    viewExt: "html",
    defaultContext: {
        name: config.Website_name,
        theme: config.Theme
    },
});

// Static files in the ./content/ folder
fastify.register(require('@fastify/static'), {
    root: path.resolve('./content/'),
    prefix: '/content/'
});

// Content type parser for the
// content type application/x-www-form-urlencoded
fastify.register(require('@fastify/formbody'));

// Support all cookie types
fastify.register(require('@fastify/cookie'), {
    secret: config.Salt,
    parseOptions: {}
});

// Session cookies (temporary cookies) used for auth
fastify.register(require('@fastify/session'), {
    cookieName: 'sessionId',
    secret: config.Salt,
    cookie: { secure: false },
    maxAge: 60 * 60 * 24 * 7
});

// Register API from /api/index.js
fastify.register(require('./api'), {
    prefix: '/api'
});

// Visual interface for cms from folder
// /admin/index.js with prefix from config
fastify.register(require('./admin'), {
    prefix: config["Admin Dashboard Prefix"]
});


// ROUTES

// Adding an icon to the website
fastify.get('/favicon.ico', (req, res) => {
    stream = fs.createReadStream(icon);
    res.type('image/png').send(stream);
});

// Reading matching the url file
// from /pages/ folder
// and converting it from md to html
// using showdown.js
// (rendering ejs file with .html ext)
fastify.get('*', (req, res) => {
    let url = req.url;
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url) url = "/home";
    try { var content = fs.readFileSync('./pages' + url + '.md', 'utf8'); }
    catch (err) { content = notFound(); }
    try { var summary = fs.readFileSync('./views/summary.md', 'utf8'); }
    catch (err) { summary = notFound(); }
    res.view('./content/themes/' + config.Theme + '/main.html', render(content, summary));
});

// Listening and analyzing the issues.
// Is restarted each time file changes
// using nodemon
fastify.listen(config.Port, '0.0.0.0', (err, host) => {
    if (err) throw err;
    onStartup(config.Website_name);
    analyze(host);
});