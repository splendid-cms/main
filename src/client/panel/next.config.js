const config = require('../../../config.json');
const { getCookie } = require('cookies-next');

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    basePath: '/' + config['Admin dashboard prefix'],
}