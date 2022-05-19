const path = require('path');
const config = require(path.resolve("./config.json"));
const icon = path.join(path.resolve('./content/media'), config.Icon);
let choice = (config.Debug.Terminal) ? require('./logger') : false;
const fastify = require('fastify')({
    logger: choice,
    ignoreTrailingSlash: true,
    disableRequestLogging: !config.Debug["Log Requests/Response"]
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
    prefix: '/content/',
    decorateReply: false
}).register(require('@fastify/static'), {
    root: path.resolve('./themes/'),
    prefix: '/themes/',
    decorateReply: false
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
    res.code(200).type('image/png').send(stream);
});

// Reading matching the url file
// from /pages/ folder
// and converting it from md to html
// using showdown.js
// (rendering ejs file with .html ext)
fastify.get('*', (req, res) => {
    let url = req.url;
    let code = 200;
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url) url = "/home";
    let cache = './cache/pages';
    let filePath = `${cache}/${url}.html`;
    let dataPath = `./pages${url}.md`;
    if (fs.existsSync(filePath) && fs.statSync(filePath).mtimeMs > fs.statSync(dataPath).mtimeMs) {
        res.code(code).view(filePath);
        return;
    }
    try { var content = fs.readFileSync(dataPath, 'utf8'); }
    catch {
        content = notFound();
        code = 404;
    }
    if (!fs.existsSync(cache)) fs.mkdirSync(cache, { recursive: true });
    res.code(code).view(`./themes/${config.Theme}/main.html`, render(content));
    if (code === 404) return;
    fastify.view(`./themes/${config.Theme}/main.html`, render(content), (err, html) => {
        fs.writeFileSync(filePath, err || html);
    });
});

// Listening and analyzing the issues.
// Is restarted each time file changes
// using nodemon
fastify.listen(config.Port, '0.0.0.0', (err, host) => {
    if (err) throw err;
    onStartup(config.Website_name);
    analyze(host);
});