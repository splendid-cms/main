const path = require('path');
const config = require(path.resolve("./config.json"));
const colorette = require('colorette');

// Analyze any available issue through a one single function
analyze = (host) => {
    const icon = path.join(path.resolve('./content/media'), config.Icon);
    const size = require('image-size')(icon);
    if ((size.width || size.height) > 48) console.log(defineMessage('WARN', 'Can not load an icon, too big size!'));
    if (!require('fs').existsSync('./themes/' + config.Theme + '/main.html')) {
        console.log(defineMessage('ERR', 'Can not find given theme, consider checking config.json!'));
        process.exit(1);
    }
    console.log(defineMessage('OK', `Listening over at ${host}.`));
}

// Beautifies given string making
// 'render-logo' look like
// 'Render logo'
beautify = (string) => {
    let str = string.charAt(0).toUpperCase() + string.slice(1);
    return str.replace(/-|_/g, ' ')
}

// Custom message format: OK, WARN, ERR
defineMessage = (type, string) => {
    if (!string) return;
    string = colorette.gray(string);
    if (type == 'OK' && config.Debug["Log In Terminal"].Info) return `${colorette.bgGreen(' OK ')} ${string}`;
    if (type == 'WARN' && config.Debug["Log In Terminal"].Warn) return `${colorette.bgYellow(' WARN ')} ${string}`;
    if (type == 'ERR' && config.Debug["Log In Terminal"].Error) return `${colorette.bgRed(' ERR ')} ${string}`;
    return colorette.white.bgRed.bold(' ERR ') + colorette.gray(' Wrong type provided!');
}

// Get formatted time like "05/14/2022 17:48:13"
getFormatTime = () => {
    let now = new Date();
    return `${
        now.getDate().toString().padStart(2, '0')}/${
        (now.getMonth()+1).toString().padStart(2, '0')}/${
        now.getFullYear().toString().padStart(4, '0')} ${
        now.getHours().toString().padStart(2, '0')}:${
        now.getMinutes().toString().padStart(2, '0')}:${
        now.getSeconds().toString().padStart(2, '0')
    }`;
}

// What to return on 404
notFound = () => {
    return '404';
}

// Startup function
onStartup = (name) => {
    console.clear();
    console.log(colorette.green(require('figlet').textSync(name)));
}

// Render elements
render = (data, summary) => {
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
showdownConverter = () => {
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
headerJSON = () => {
    let header = JSON.stringify(config.Content.Header);
    header = header
        .replace(/"(.*?)":"(.*?)"/gm, '<li><a href="$2">$1</a></li>')
        .replace('{', '<ul class="header-items">').replace('}', '</ul>')
        .replace(/<\/li>,<li>/gm, '</li><li>');
    return header;
}

// Convert sidebar JSON to sidebar HTML list
sidebarJSON = () => {
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