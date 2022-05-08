const fs = require('fs');

module.exports = function (fastify, opts, next) {
    fastify.get('/test', (req, res) => {
        res.send('test')
    });
    fastify.get('/login', (req, res) => {
        
    });
    fastify.get('/plugin/:plugin/config', (req, res) => {
        try { var content = fs.readFileSync('./plugins/' + req.params.plugin + '/config.json', 'utf8'); }
        catch (err) { content = notFound(); }
        res.send(content);
    });
    fastify.get('/dashboard', (req, res) => {
        res.view('./content/admin/html/main.html', {
            url: req.url.slice(10)
        });
    });
    fastify.get('/plugins', (req, res) => {
        res.view('./content/admin/html/main.html', {
            url: req.url.slice(10)
        });
    });
    fastify.get('', (req, res) => {
        res.redirect('/spl-admin/dashboard');
    });
    next();
}