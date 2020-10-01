const url = ''
const username = ''
const password = ''

const webhook = {
    courses: '',
    homework: '',
    results: '',
    other: ''
}

const etab = {
    name: '',
    id: '',
    publicurl: ''
}

// Replace getTimediff() with your own Time difference (see README)
// or leave it to get it automatically.
const timediff = getTimediff()
function getTimediff() {
    let utc = new Date()
    return offset = -utc.getTimezoneOffset()/60
}

const storage = './storage.json'

module.exports = { url, username, password, webhook, etab, timediff };
