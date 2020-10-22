const fs = require('fs')

function read() {
    return(JSON.parse(fs.readFileSync('./config.json')))
}

function version() {
    return(JSON.parse(fs.readFileSync(read()['settings']['version'])))
}

function timediff() {
    if (read()['settings']['timediff'] !== "default") {
        return parseInt(read()['settings']['timediff'])
    } else {
        let utc = new Date()
        return offset = -utc.getTimezoneOffset()/60
    }
}

module.exports = { read, version, timediff }