const url = 'https://1234567X.index-education.net/pronote/eleve.html'
const username = 'USERNAME'
const password = 'MySecretPassword'

const webhook = {
    courses: 'https://discordapp.com/api/webhooks/0/MySecretWebhook',
    homework: 'https://discordapp.com/api/webhooks/0/MySecretWebhook',
    results: 'https://discordapp.com/api/webhooks/0/MySecretWebhook',
    other: 'https://discordapp.com/api/webhooks/0/MySecretWebhook'
}

const etab = {
    name: 'Lycée XXX',
    id: '1234567X',
    publicurl: 'https://1234567X.index-education.net/pronote/'
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
