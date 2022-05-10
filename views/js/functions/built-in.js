const sessions = './cache/sessions';
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const config = require(path.resolve("./config.json"));

sha256 = function (data) {
    return crypto.createHash('sha256').update(data, 'utf-8').digest('hex')
}

hashPassword = function () {
    return sha256([...Array.from(arguments), config.Salt].join(''))
}

getSession = function (token) {
    const filePath = path.join(sessions, token);
    if (!fs.existsSync(filePath)) return;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

saveSession = function (token, payload) {
    const filePath = path.join(sessions, token);
    fs.access(filePath, function (err) {
        if (err) fs.mkdirSync(sessions, { recursive: true })
    });
    fs.writeFile(filePath, JSON.stringify(payload), function (err) {
        if (err) throw new Error(err);
    });
}

eraseSession = function (token) {
    const filePath = path.join(sessions, token);
    if (fs.existsSync(filePath)) return fs.rmSync(filePath, { force: true });
}

module.exports = {
    sha256, hashPassword, getSession, saveSession, eraseSession
}

// fastify.get('/user', async (req, res) => {
//     let user = null;
//     try {
//         user = getSession(req.cookies.session);
//     } catch {
//         return res.code(403).send({ message: 'Authorization required' })
//     }
//     user = config.Users.find(item => item.ID === user.ID);
//     return { hello: user.Name }
// });
// fastify.get('/login', async (req, res) => {
//     const body = req.query;
//     const userData = config.Users.find(user => user.Email === body.email && hashPassword(user.Email, user.Password) === hashPassword(body.email, body.password));
//     if (!userData) return res.code(400).send({ message: 'Invalid credentials provided'})
//     const token = sha256(userData.Email);
//     saveSession(token, { ID: userData.ID });
//     res
//         .setCookie('session', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
//         .send({ welcome: userData.Name });
// });
// fastify.get('/logout', async (req, res) => {
//     eraseSession(req.cookies.session);
//     return res.clearCookie('session').send({ good: 'bye' });
// });