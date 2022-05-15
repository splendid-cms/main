const chalk = require('chalk');

module.exports = class Logger {
    constructor(...args) {
        this.args = args;
    }

    // Info log,
    // return if not an object,
    // return response if res exists,
    // return request if else
    info(arg) {
        if (typeof arg !== 'object') return console.log(chalk.bgGreen(` ${getFormatTime()} `) + ': ' + arg);
        if (arg.hasOwnProperty('res')) {
            var message = chalk.gray(
                arg.res.raw.req.method +
                chalk.white(arg.res.raw.req.url) +
                ' response for ' +
                Math.round(arg.responseTime) + 'ms'
            );
            saveLog('info',
                arg.res.raw.req.method +
                arg.res.raw.req.url +
                ' response for ' +
                Math.round(arg.responseTime) + 'ms'
            );
        }
        else {
            var message = chalk.gray(
                arg.req.raw.method +
                chalk.white(arg.req.raw.url) +
                ' request'
            );
            saveLog('info',
                arg.req.raw.method +
                arg.req.raw.url +
                ' request'
            );
        }
        console.log(chalk.bgGreen(` ${getFormatTime()} `) + ': ' + message);
    }

    // Either
    // return error with full error code
    // or an argument if there's no
    // given keys
    error(arg) {
        try {
            var message = chalk.gray(
                arg.req.raw.method +
                chalk.white(arg.req.raw.url) +
                ' with error code ' +
                arg.err.code
            );
            saveLog('errors', arg.err.code);
        } catch {
            var message = chalk.gray(arg);
            saveLog('errors', arg);
        }
        console.log(chalk.bgRed(` ${getFormatTime()} `) + ': ' + message);
    }

    // Debug log with bg blue
    debug(arg) {
        console.log(chalk.bgBlue(` ${getFormatTime()} `) + ': ' + chalk.gray(arg));
    }

    // Return error code if given,
    // else return entire arg
    fatal(arg) {
        try {
            var message = chalk.gray(
                'Fatal error with code ' +
                arg.err.code
            );
            saveLog('fatal', arg.err.code);
        } catch {
            var message = chalk.gray(arg);
            saveLog('fatal', arg);
        }
        console.log(chalk.bgMagenta(` ${getFormatTime()} `) + ': ' + message);
    }

    // Works the same as error
    warn(arg) {
        try {
            var message = chalk.gray(
                arg.req.raw.method +
                chalk.white(arg.req.raw.url) +
                ' with error code ' +
                arg.err.code
            );
        } catch {
            var message = chalk.gray(arg);
        }
        console.log(chalk.bgYellow(` ${getFormatTime()} `) + ': ' + message);
    }

    // Trace log with bg cyan
    trace(arg) {
        console.log(chalk.bgCyan(` ${getFormatTime()} `) + ': ' + chalk.gray(arg));
    }

    child() { return new Logger(); }
}