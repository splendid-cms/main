const fs = require('fs');
const path = require('path');
const config = require(path.resolve('./config.json'));

module.exports = function (fastify, opts, next) {
    fastify.get('/test', (req, res) => {
        res.send(`
        ${req.cookies.userid} - id
        ${req.cookies.password} - password
        `);
    });
    fastify.get('/login', (req, res) => {
        // const body = req.body;
        // if (config['User ID'] === body.userid && config.Password === body.password) return res.send('all gud');
        res.cookie('userid', '123'/*body.userid*/, {
            path: config["Admin Dashboard Prefix"],
            signed: true
        }).cookie('password', '123'/*body.password*/, {
            path: config["Admin Dashboard Prefix"],
            signed: true
        })
        res.send('success ig')
    });
    fastify.get('/unlogin', (req, res) => {

        res.send(`success idk ${JSON.stringify(fastify.unsignCookie(req.cookies.password))}`);
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
            .filter((item) => {
                if (fs.existsSync(`./plugins/${item.name}/main.js`)) return true;
                content += `
                <div class="box">
                    <i class='bx bxs-message-alt-error'></i>
                    Poorly formed "${beautify(item.name)}" plugin: missing main.js
                </div>`
                return false;
            })
            .map((item) => item.name)
            .forEach((directory) => {
                const {_developer, _description, _version, ...rest} = require(path.resolve(`./plugins/${directory}/config.json`)) || {};
                let cog = `- <a href="plugins/${directory}/config">configure</a>`;
                if (Object.keys(rest).length === 0) cog = '';
                if (config.Plugins.includes(directory)) var act = 'active';
                content += `
                <tr>
                    <td>${beautify(directory)}<br><span>${_developer || 'Unknown'}</span></td>
                    <td>
                        ${_description || ''}<br>
                        <span>v${_version || '1.0'} - ${act || 'deactive'} ${cog}</span>
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
        let url = req.url;
        if (url.endsWith('/')) url = url.slice(0, -1)
        res.redirect(url + '/dashboard');
    });
    next();
}