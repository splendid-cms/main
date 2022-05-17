const config = require(require('path').resolve("./config.json"));
const colorette = require('colorette');

module.exports = {
    useOnlyCustomLevels: true,
    customLevels: {
        info: 'info',
        fatal: 'fatal',
        error: 'error',
        warn: 'warn',
        debug: 'debug',
    },
    prettyPrint: {
        messageKey: 'msg',
        timestampKey: false,
        // Don't log these automatically
        ignore: 'pid,hostname,reqId,responseTime,req,res,err',
        messageFormat: (log, messageKey) => {
            saveLog(log.level, JSON.stringify(log)); // save each log with json

            // If error
            if (log.err && log.req) {
                let methodurl = log.req.method + colorette.white(log.req.url);
                let out = methodurl + ' ' + log[messageKey].toLowerCase();
                return colorette.gray(out);
            }

            // If response
            if (log.res) {
                let time = Math.round(log.responseTime);
                let out = `${log[messageKey]} for ${time}ms`;
                if (!config.Debug['Log Requests/Response']) return;
                return colorette.gray(out);
            }

            // If request
            if (log.req) {
                let methodurl = log.req.method + colorette.white(log.req.url);
                let out = methodurl + ' ' + log[messageKey].toLowerCase() + ' from ' + log.req.remoteAddress;
                if (!config.Debug['Log Requests/Response']) return;
                return colorette.gray(out);
            }

            // Else
            return colorette.gray(log[messageKey]);
        },
        customPrettifiers: {
            // Colorize self-made timestamp
            level: ll => {
                let time = ` ${getFormatTime()} `;
                let out = colorette.inverse(time);
                if (ll === 'debug') out = colorette.bgBlue(time);
                if (ll === 'info') out = colorette.bgGreen(time);
                if (ll === 'warn') out = colorette.bgYellow(time);
                if (ll === 'error') out = colorette.bgRed(time);
                if (ll === 'fatal') out = colorette.bgMagenta(time);
                return out;
            }
        }
    }
}