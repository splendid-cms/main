onStartup = function(name) {
    console.clear();
    console.log(require('chalk').green.bold(require('figlet').textSync(name, "Speed")));
}
module.exports = onStartup