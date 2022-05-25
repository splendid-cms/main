const sessions = './cache/sessions';
const logs = './cache/log';
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const config = require(path.resolve("./config.json"));
const glob = require('tiny-glob');

convertPages = async fastify => {
    const files = await glob('./pages/**/*.md');
    let percent = 1;
    fs.rmSync('./cache/pages', { force: true, recursive: true });
    files.forEach(async file => {
        let progress = Math.round(percent / files.length * 100);
        if (config.Debug.Terminal) printProgress(progress, `Converting ${file}!`);
        percent++;
        let data = fs.readFileSync(file, 'utf-8');
        const html = await fastify.view(`./themes/${config.Theme}/main.html`, render(data));
        if (!fs.existsSync('./cache/' + path.dirname(file))) fs.mkdirSync('./cache/' + path.dirname(file), { recursive: true });
        fs.writeFileSync(path.join('./cache', file.slice(0, -3) + '.html'), html);
    });
    if (!config.Debug.Terminal) return;
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    fastify.log.info(`Converted ${files.length} markdown files to HTML!`);
}

// Encrypts data using sha256
sha256 = data => {
    return crypto.createHash('sha256').update(data, 'utf-8').digest('hex')
}

// Hashes the password with a salt
hashPassword = (...args) => {
    return sha256([...Array.from(args), config.Salt].join(''))
}

// Gets the session info, returns error
// if there's no session file
// or if it's not logged in
getSession = token => {
    const filePath = path.join(sessions, token);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Saves the session in cache/session/[token]
saveSession = (token, payload) => {
    const filePath = path.join(sessions, token);
    if (!fs.existsSync(sessions)) fs.mkdirSync(sessions, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(payload));
}

// Hardly logs out all sessions for an account.
eraseSession = token => {
    const filePath = path.join(sessions, token);
    if (fs.existsSync(filePath)) return fs.rmSync(filePath, { force: true });
}

// Saves a given data in the /cache/log/[type]/[1...].log file
saveLog = (type, payload) => {
    let dirPath = path.join(logs, type);
    let first = path.join(dirPath, '1.log');
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    if (!fs.existsSync(first)) fs.writeFileSync(first, '');
    let last = fs.readdirSync(dirPath).pop();
    let fileIndex = parseInt(last.slice(0, -4));
    let lines = fs.readFileSync(path.join(dirPath, last), 'utf-8').split(/\r?\n/);
    if (lines.length > 200) fileIndex++;
    let filePath = path.join(dirPath, fileIndex + '.log');
    fs.appendFileSync(filePath, `${getFormatTime()} ${payload}\n`);
}

module.exports = {
    sha256, hashPassword, getSession, saveSession, eraseSession
}