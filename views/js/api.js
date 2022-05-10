const fs = require('fs');
const path = require('path');
const cfgPath = path.resolve('./config.json');
const config = require(cfgPath);

module.exports = function (fastify, opts, next) {
    fastify.get('/plugin/toggle/:plugin', (req, res) => {
        let plugin = req.params.plugin;
        if (req.query.key != config["API Key"]) return res.send({statusCode: '401'});
        if (!plugin || !fs.existsSync(path.resolve(`./plugins/${plugin}/main.js`))) return res.send({statusCode: '404'});
        let index = config.Plugins.indexOf(plugin);
        if (index === -1) config.Plugins.push(plugin);
        else config.Plugins.splice(index, 1);
        fs.writeFile(cfgPath, JSON.stringify(config, null, 4), (err, res) => {
            if (err) console.log(err);
        });
        res.send({statusCode: '200'});
    });
    next();
}