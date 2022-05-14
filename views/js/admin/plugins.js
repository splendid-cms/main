const fs = require('fs');
const path = require('path');
const cfgPath = path.resolve('./config.json');
const config = require(cfgPath);

module.exports = function (fastify, opts, next) {

    // Removing cache control for each request except main page
    fastify.addHook("onRequest", async (req, res) => {
        if (!req.url) return;
		res.headers({
			"Cache-Control": "no-store, max-age=0, must-revalidate",
			Expires: "0",
			Pragma: "no-cache",
			"Surrogate-Control": "no-store",
		});
	});

    // Configuration file, soon will be updated
    fastify.get('/:plugin/config', (req, res) => {
        try { var content = fs.readFileSync('./plugins/' + req.params.plugin + '/config.json', 'utf8'); }
        catch (err) { content = notFound(); }
        res.send(content);
    });

    // Plugin toggle link
    fastify.get('/:plugin/toggle', (req, res) => {
        let plugin = req.params.plugin;
        if (!plugin || !fs.existsSync(path.resolve(`./plugins/${plugin}/main.js`))) return res.send({statusCode: '404'});
        let index = config.Plugins.indexOf(plugin);
        if (index === -1) config.Plugins.push(plugin);
        else config.Plugins.splice(index, 1);
        fs.writeFileSync(cfgPath, JSON.stringify(config, null, 4))
        res.code(301).redirect(`${config["Admin Dashboard Prefix"]}/plugins`);
    });

    // Main plugin web page
    fastify.get('', (req, res) => {
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
                        <span>v${_version || '1.0'} - <a href="plugins/${directory}/toggle">${act || 'deactive'}</a> ${cog}</span>
                    </td>
                </tr>`;
            });
            res.view('./content/admin/html/main.html', {
                url: req.url.slice(10),
                content: content
            });
        });
    });
    next();
}