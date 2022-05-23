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

    // Configuration file
    fastify.get('/:plugin/config', (req, res) => {
        let filePath = `./plugins/${req.params.plugin}/config.json`
        if (!fs.existsSync(filePath)) res.code(404).send('not found go away lmao noob 404');
        let content = JSON.stringify(JSON.parse(fs.readFileSync(filePath, 'utf8')));
        let brlength = content.split("}").length - 1;
        content = content
        .replace(/"_comment":"(.*?)"(?:,|)/g, '<p>$1</p>')
        .replace(/"_([^"]*)":"(.*?)"(?:,|)/g, '')
        .replace(/"([^"]*)":"(.*?)"/g, '<section><label>$1</label><input type="text" value="$2" placeholder="$2" required></section>')
        .replace(/"([^"]*)":/g, '<h2>$1</h2>')
        .replace(/(>|}),</gm, '$1<');
        for (let i = 0; i < brlength; i++) content = content.replace(/{(.*?)}/g, '<div class="staircase">$1</div>');
        res.code(200).view('./content/admin/html/main.html', {
            url: "plugin-config",
            content: content
        });
    });

    // Theme toggle link
    fastify.get('/:theme/toggle', (req, res) => {
        let theme = req.params.theme;
        if (!theme || (!fs.existsSync(`./themes/${theme}/main.html`) && !fs.existsSync(`./themes/${theme}/main.ejs`))) {
            return res.code(404).send({statusCode: '404'});
        }
        config.Theme = theme;
        fs.writeFileSync(cfgPath, JSON.stringify(config, null, 4));
        fastify.log.warn('Theme has been changed');
        convertPages(fastify);
        res.code(301).redirect(`${config["Admin Dashboard Prefix"]}/themes`);
    });

    // Previewing a theme via getting home.md data
    fastify.get('/:theme/preview', (req, res) => {
        const theme = req.params.theme;
        const dataPath = './pages/home.md';
        let code = 200;
        var main;
        if (!fs.existsSync(`./themes/${theme}/main.ejs`)) main = 'main.ejs';
        if (!fs.existsSync(`./themes/${theme}/main.html`)) main = 'main.html';
        if (!fs.existsSync(dataPath)) return res.code(404).send({statusCode: 404}); // Soon
        if (!theme || !main) return res.code(404).send({statusCode: 404});
        try { var content = fs.readFileSync(dataPath, 'utf8'); }
        catch {
            content = notFound();
            code = 404;
        }
        res.code(code).view(`./themes/${theme}/${main}`, render(content));
    })

    // Main theme web page
    fastify.get('', (req, res) => {
        var content = '';
        fs.readdir('./themes', { withFileTypes: true }, (err, files) => {
            files.filter((item) => item.isDirectory())
            .filter((item) => {
                if (fs.existsSync(`./themes/${item.name}/main.html`) || fs.existsSync(`./themes/${item.name}/main.ejs`)) return true;
                content += `
                <div class="box">
                    <section>
                        <img
                            class="preview"
                            src="/themes/${item.name}/preview.png"
                            title="${beautify(item.name)}"
                            onerror="this.style.opacity='0'"
                        />
                    </section>
                    <section>
                        <label>${beautify(item.name)}</label>
                        <span><i class='bx bxs-message-alt-error'></i>
                        Poorly formed theme: missing main.html/main.ejs
                        </span>
                    </section>
                </div>`
                return false;
            })
            .map((item) => item.name)
            .forEach((directory) => {
                let filePath = `./themes/${directory}/config.json`;
                if (fs.existsSync(filePath)) {
                    var {_developer, _version, ...rest} = require(path.resolve(filePath));
                    if (Object.keys(rest).length !== 0) var cog = `- <a href="themes/${directory}/config">configure</a>`;
                }
                if (config.Theme === directory) var act = 'active';
                content += `
                <div class="box">
                    <section>
                        <img
                            class="preview"
                            src="/themes/${directory}/preview.png"
                            title="${beautify(directory)}"
                            onerror="this.style.opacity='0'"
                        />
                    </section>
                    <section>
                    <label>${beautify(directory)}<span> ${_developer || 'Unknown'}</span></label>
                    <span>v${_version || '1.0'} - <a href="themes/${directory}/toggle">${act || 'inactive'}</a> ${cog || ''}</span>
                    </section>
                    <a
                        class="previewButton"
                        href="./themes/${directory}/preview"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                    <span>Preview</span>
                    <i class='bx bx-window-open'></i>
                    </a>
                </div>`;
            });
            res.code(200).view('./content/admin/html/main.html', {
                url: "themes",
                content: content
            });
        });
    });
    next();
}