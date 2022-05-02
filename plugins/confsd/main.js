const cfg = require('./config.json')
showdownConverter = function() {
    return {
        strikethrough: cfg.strikethrough,
        tables: cfg.tables,
        underline: cfg.underline,
        disableForced4SpacesIndentedSublists: cfg.disableForced4SpacesIndentedSublists,
        openLinksInNewWindow: cfg.openLinksInNewWindow,
        extensions: [require('showdown-highlight')({ pre: true })]
    }
}
module.exports = showdownConverter