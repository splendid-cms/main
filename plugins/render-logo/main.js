const showdown  = require('showdown');
const config = require(path.resolve('./config.json'));
const pluginConfig = require('./config.json');
const converter = new showdown.Converter(showdownConverter());

// Render elements
render = function(data, summary) {
    return {
        content: converter.makeHtml(data),
        header: headerJSON(),
        sidebar: sidebarJSON(),
        footer: converter.makeHtml(config.Content.Footer),
        logo: pluginConfig.LogoPath
    }
}
module.exports = render;