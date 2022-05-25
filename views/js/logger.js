const config = require(require('path').resolve("./config.json"));
const colorette = require('colorette');

module.exports = {
    prettyPrint: {
        timestampKey: false,
        // Don't log these automatically
        ignore: 'pid,hostname,reqId,responseTime,req,res,err,stack,type,code,errno,syscall,address,port,path',
        messageFormat: (log, messageKey) => {

            let level = log.level.toString()
            .replace(10, 'trace')
            .replace(20, 'debug')
            .replace(30, 'info')
            .replace(40, 'warn')
            .replace(50, 'error')
            .replace(60, 'fatal');
            saveLog(level, JSON.stringify(log)); // save each log with json

            // If error
            if (log.err && log.req) {
                let methodurl = `${log.req.method}:${colorette.white(log.req.url)}`;
                let out = methodurl + ' ' + log[messageKey].toLowerCase();
                return colorette.gray(out);
            }

            if (log.err && log.res) {
                let out = `${colorette.white(log.res.statusCode)} ${log[messageKey]}`;
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
                let methodurl = `${log.req.method}:${colorette.white(log.req.url)}`;
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
                if (ll === 10) out = colorette.bgCyan(time);
                if (ll === 20) out = colorette.bgBlue(time);
                if (ll === 30) out = colorette.bgGreen(time);
                if (ll === 40) out = colorette.bgYellow(time);
                if (ll === 50) out = colorette.bgRed(time);
                if (ll === 60) out = colorette.bgMagenta(time);
                return out;
            }
        }
    }
}