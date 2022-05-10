const fs = require('fs');
const path = require('path');
const config = require(path.resolve('./config.json'));
const login = `${config["Admin Dashboard Prefix"]}/login`;

module.exports = function (fastify, opts, next) {
    fastify.addHook('preValidation', (req, res, next) => {
        const url = req.url.split("?").shift();
        if (url == login) return next();
        try { const session = getSession(req.cookies.session) }
        catch { res.redirect(login) }
        next();
    });
    fastify.get('/user', (req, res) => {
        let user = null;
        try {
            user = getSession(req.cookies.session);
        } catch {
            return res.code(403).send({ message: 'Authorization required' })
        }
        user = config.Users.find(item => item.ID === user.ID);
        return { hello: user.Name }
    });
    fastify.get('/auth', (req, res) => {
        const q = req.query;
        const userData = config.Users.find(user => user.Email === q.email && hashPassword(user.Email, user.Password) === hashPassword(q.email, q.password));
        if (!userData) return res.code(400).send({ message: 'Invalid credentials provided'})
        const token = sha256(userData.Email);
        saveSession(token, { ID: userData.ID });
        res.setCookie('session', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
        res.send({succ: 'dick'})
    });
    fastify.get('/login', (req, res) => {
        res.view('./content/admin/pages/login.html');
    });
    fastify.get('/logout', (req, res) => {
        eraseSession(req.cookies.session);
        res.clearCookie('session', {
            path: config["Admin Dashboard Prefix"]
        })
        res.code(301).redirect(login);
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