const chalk = require('chalk');
const fs = require('fs');

module.exports = class Logger {
    constructor(...args) {
        this.args = args;
    }
    info(arg) {
        try {
            var message = chalk.gray(
                arg.res.raw.req.method +
                chalk.white(arg.res.raw.req.url) +
                ' response for ' +
                Math.round(arg.responseTime) + 'ms'
            );
        } catch {return}
        console.log(chalk.bgGreen(` ${getFormatTime()} `) + ': ' + message);
    }
    error(arg) {
        try {
            var message = chalk.gray(
                arg.req.raw.method +
                chalk.white(arg.req.raw.url) +
                ' with error code ' +
                arg.err.code
            );
        } catch {return}
        console.log(chalk.bgRed(` ${getFormatTime()} `) + ': ' + message);
        saveError(arg.err.code);
    }
    debug(arg) { console.log(arg); /*blue*/ }
    fatal(arg) { console.log(arg); /*purple*/ }
    warn(arg) { console.log(arg); /*orange*/ }
    trace(arg) { console.log(arg); /*cyan*/ }
    child() { return new Logger(); }
}