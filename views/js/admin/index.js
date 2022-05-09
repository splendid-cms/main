const fs = require('fs');
const path = require('path');
const config = require(path.resolve('./config.json'));

module.exports = function (fastify, opts, next) {
    fastify.get('/test', (req, res) => {
        res.send('test')
    });
    fastify.get('/login', (req, res) => {
        
    });
    fastify.get('/plugins/:plugin/config', (req, res) => {
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
        var content = '';
        fs.readdir('./plugins', { withFileTypes: true }, (err, files) => {
            files.filter((item) => item.isDirectory())
            .filter((item) => fs.existsSync(`./plugins/${item.name}/main.js`))
            .map((item) => item.name)
            .forEach((directory) => {
                const {_developer, ...rest} = require(path.resolve(`./plugins/${directory}/config.json`)) || {};
                const cog = `- <a href="plugins/${directory}/config">configure</a>`;
                if (Object.keys(rest).length === 0) cog = '';
                if (config.Plugins.includes(directory)) var act = 'active';
                content += `
                <tr>
                    <td>${beautify(directory)}<br><span>${_developer || 'Unknown'}</span></td>
                    <td>
                        ${rest._description || ''}<br>
                        <span>v${rest._version || '1.0'} - ${act || 'deactive'} ${cog}</span>
                    </td>
                </tr>`;
            });
            res.view('./content/admin/html/main.html', {
                url: req.url.slice(10),
                content: content
            });
        });
    });
    fastify.get('', (req, res) => {
        res.redirect('/spl-admin/dashboard');
    });
    next();
}