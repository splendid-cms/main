const path = require('path');
const config = require(path.resolve("./config.json"));
const icon = path.join(path.resolve('./content/media'), config.Icon);
const fastify = require('fastify')({ logger: config.Debug });
const fs = require('fs');
require('./functions');

// Middleware.
fastify.register(require("point-of-view"), {
    engine: { ejs: require("ejs") },
}).register(require('@fastify/static'), {
    root: path.resolve('./content/'),
    prefix: '/content/'
});

fastify.get('/favicon.ico', (req, res) => {
    stream = fs.createReadStream(icon);
    res.type('image/png').send(stream);
});

fastify.get('*', (req, res) => {
    let url = req.url;
    if (url.endsWith('/')) url = url.slice(0, -1);
    if (!url) url = "/home";
    try { var content = fs.readFileSync('./pages' + url + '.md', 'utf8'); }
    catch (err) { content = notFound(); }
    try { var summary = fs.readFileSync('./views/summary.md', 'utf8'); }
    catch (err) { summary = notFound(); }
    res.view('./content/themes/' + config.Theme + '/main.ejs', render(content, summary));
});
fastify.listen(config.Port, async () => {
    onStartup(config.Website_name);
    analyze();
    sidebarJSON();
});