const config = require('../../../config.json');

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    basePath: '/' + config['Admin dashboard prefix'],
}