const path = require('path');
const config = require(path.resolve("./config.json"));
const icon = path.join(path.resolve('./content/media'), config.Icon);
const colorette = require('colorette');
const choice = (config.Debug.Terminal) ? require('./logger') : false;
const fs = require('fs');
const fastify = require('fastify')({
    logger: choice,
    ignoreTrailingSlash: true,
    disableRequestLogging: !config.Debug["Log Requests/Response"]
});

// Adding additional functions
require('./functions/additional');

// Overwriting all additional functions
// with built-in functions
require('./functions/built-in');


// HOOKS & FUNCTIONS

fastify.addHook('onRegister', (instance, opts) => {
    fastify.log.info(`Registered ${colorette.white(opts.prefix)} path`);
});

// Reloads all plugins if the function is called!
watch = () => {
    fastify.log.warn('Reloading plugins...');
    try {
        delete require.cache[require.resolve('./functions/additional.js')]
        require('./functions/additional');
        fastify.log.info('Reload completed!');
    } catch (err) {
        fastify.log.error(err);
        return;
    }
}


// MIDDLEWARE

// Used for EJS support
fastify.register(require("point-of-view"), {
    engine: { ejs: require("ejs") },
    viewExt: "html",
    defaultContext: defaultEngineContext(),
    options: {
        localsName: 'ignore' // ignore.* object for keys that may be undefined because of missing plugins
    }
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
fastify.get('*', async (req, res) => {
    let url = decodeURI(req.url);
    let code;
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url) url = '/home';
    let dataPath = `./cache/pages${url}.html`;
    if (!fs.existsSync(dataPath)) code = 404;
    let stream = fs.createReadStream(dataPath);
    await res.code(code || 200).type('text/html').send(stream);
});

fastify.setErrorHandler(function (err, req, res) {
    let filePath = './content/admin/html/error.html';
    let layout = `./themes/${config.Theme}/404.html`;
    if (err.code === 'ENOENT') {
        // If theme has 404.html render its file
        if (fs.existsSync(layout)) {
            res.view(layout, render(JSON.stringify(err)));
            return;
        };
        // Else render basic notFound() from
        // ./content/admin/html/error.html
        res.view(filePath, render(notFound(JSON.stringify(err))));
        return;
    }
    // Log error in a warn state
    fastify.log.warn(err);
    let error = `<h1 style="color:#76a43d;">${err.code}</h1>${err}`;
    // Send error response
    res.view(filePath, render(error));
});

// Listening and analyzing the issues.
// Is restarted each time file changes
// using nodemon
onStartup(config.Website_name);
convertPages(fastify);
fastify.listen(config.Port, config.Address, async (err) => {
    if (err) throw err;
    analyze(fastify);
});

process.on('uncaughtException', function (err) {
    fastify.log.error(err);
});

process.on('exit', (code) => {
    fastify.log.warn(`Exit with code ${code}`);
});