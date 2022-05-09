const cfg = require('./config.json');
module.exports = showdownConverter = function() {
    let xt = { extensions: [require('showdown-highlight')({ pre: true })] }
    if (cfg) return Object.assign(cfg, xt);
    return defineMessage('ERR', 'Error performing configuration for "configure-showdown"!')
}