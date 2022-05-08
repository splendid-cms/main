const cfg = require('./config.json');
module.exports = onStartup = function(name) {
    try {
        const ascii = require('figlet').textSync(name, cfg.Font);
        console.clear();
        console.log(require('chalk').green.bold(ascii));
    } catch (err) {
        console.log(defineMessage('ERR', `Consider entering valid name. Can not find "${cfg.Font || "Empty"}" theme!`));
        process.exit(1);
    }
}