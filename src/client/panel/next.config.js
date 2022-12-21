const { splendid } = require('../../../package.json');

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
    basePath: '/' + splendid.adminDashboardPrefix,
}