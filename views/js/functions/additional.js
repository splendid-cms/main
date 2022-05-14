const path = require('path');
const config = require(path.resolve("./config.json"));
const chalk = require('chalk');

// Analyze any available issue through a one single function
analyze = function (host) {
    const icon = path.join(path.resolve('./content/media'), config.Icon);
    const size = require('image-size')(icon);
    if ((size.width || size.height) > 48) console.log(defineMessage('WARN', 'Can not load an icon, too big size!'));
    if (!require('fs').existsSync('./content/themes/' + config.Theme + '/main.html')) {
        console.log(defineMessage('ERR', 'Can not find given theme, consider checking config.json!'));
        process.exit(1);
    }
    console.log(defineMessage('OK', `Listening over at ${host}.`));
}

// Beautifies given string making
// 'render-logo' look like
// 'Render logo'
beautify = function (string) {
    let str = string.charAt(0).toUpperCase() + string.slice(1);
    return str.replace(/-|_/g, ' ')
}

// Custom message format: OK, WARN, ERR
defineMessage = function (type, string) {
    if (!string) return;
    string = chalk.gray(string);
    if (type == 'OK') return chalk.bgGreen(' OK ') + ' ' + string;
    if (type == 'WARN') return chalk.bgYellow(' WARN ') + ' ' + string;
    if (type == 'ERR') return chalk.bgRed(' ERR ') + ' ' + string;
    return chalk.white.bgRed.bold(' ERR ') + chalk.gray(' Wrong type provided!');
}

// Get formatted time like "05/14/2022 17:48:13"
getFormatTime = function () {
    let now = new Date();
    return `${
        (now.getMonth()+1).toString().padStart(2, '0')}/${
        now.getDate().toString().padStart(2, '0')}/${
        now.getFullYear().toString().padStart(4, '0')} ${
        now.getHours().toString().padStart(2, '0')}:${
        now.getMinutes().toString().padStart(2, '0')}:${
        now.getSeconds().toString().padStart(2, '0')
    }`;
}

// What to return on 404
notFound = function () {
    return '404';
}

// Startup function
onStartup = function (name) {
    console.clear();
    console.log(chalk.green.bold(require('figlet').textSync(name)));
}

// Render elements
render = function (data, summary) {
    const showdown = require('showdown');
    const converter = new showdown.Converter(showdownConverter());
    return {
        content: converter.makeHtml(data),
        header: headerJSON(),
        sidebar: sidebarJSON(),
        footer: converter.makeHtml(config.Content.Footer)
    }
}

// Showdown converter options
showdownConverter = function () {
    return {
        strikethrough: 'true',
        tables: 'true',
        underline: 'true',
        disableForced4SpacesIndentedSublists: 'true',
        openLinksInNewWindow: 'true',
        extensions: [require('showdown-highlight')({ pre: true })]
    }
}

// Convert header JSON to header HTML
headerJSON = function () {
    let header = JSON.stringify(config.Content.Header);
    header = header
        .replace(/"(.*?)":"(.*?)"/gm, '<li><a href="$2">$1</a></li>')
        .replace('{', '<ul class="header-items">').replace('}', '</ul>')
        .replace(/<\/li>,<li>/gm, '</li><li>');
    return header;
}

// Convert sidebar JSON to sidebar HTML list
sidebarJSON = function () {
    let sidebar = JSON.stringify(config.Content.Sidebar);
    let brlength = sidebar.split("}").length - 3;
    sidebar = sidebar.slice(1, -1)
        .replace(/"([^"]*)":"(.*?)"/g, `<a href='$2'>$1</a>`)
        .replace(/"([^"]*)":{(.*)}/g, '</li><li><p>$1</p>$2</li>')
        .replace(/,/g, '');
    for (let i = 0; i < brlength; i++) sidebar = sidebar.replace(/"([^"]*)":{(.*)}/g, '<ul><li><p>$1</p>$2</ul></li>')
    return '<ul><li>' + sidebar + '</ul>';
}

// Custom plugins
var plugins = [];
config.Plugins.forEach(function(element, index) {
    try {
        plugins.push(require(path.resolve('./plugins/' + element + '/main.js')));
    } catch (err) {
        console.error(defineMessage('ERR', element + ' plugin: ' + err));
        process.exit(1);
    }
});

module.exports = {
    defineMessage, onStartup, render, plugins
}