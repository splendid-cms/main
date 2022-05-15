const sessions = './cache/sessions';
const logs = './cache/log';
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const config = require(path.resolve("./config.json"));

// Encrypts data using sha256
sha256 = function (data) {
    return crypto.createHash('sha256').update(data, 'utf-8').digest('hex')
}

// Hashes the password with a salt
hashPassword = function () {
    return sha256([...Array.from(arguments), config.Salt].join(''))
}

// Gets the session info, returns error
// if there's no session file
// or if it's not logged in
getSession = function (token) {
    const filePath = path.join(sessions, token);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Saves the session in cache/session/[token]
saveSession = function (token, payload) {
    const filePath = path.join(sessions, token);
    if (!fs.existsSync(sessions)) fs.mkdirSync(sessions, { recursive: true });
    console.log(defineMessage('WARN', 'New account has logged in! Creating new session.'));
    fs.writeFileSync(filePath, JSON.stringify(payload));
}

// Hardly logs out all sessions for an account.
eraseSession = function (token) {
    const filePath = path.join(sessions, token);
    if (fs.existsSync(filePath)) return fs.rmSync(filePath, { force: true });
}

// Saves a given error in the /cache/log/errors
saveLog = function (type, payload) {
    const filePath = path.join(logs, type);
    if (!fs.existsSync(logs)) fs.mkdirSync(logs, { recursive: true });
    fs.appendFileSync(filePath, `${getFormatTime()} ${payload}\n`);
}

module.exports = {
    sha256, hashPassword, getSession, saveSession, eraseSession
}