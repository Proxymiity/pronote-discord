const url = 'https://1234567X.index-education.net/pronote/eleve.html'
const username = 'USERNAME'
const password = 'MySecretPassword'

const webhook = {
    courses: 'https://discordapp.com/api/webhooks/0/MySecretWebhook',
    homework: 'https://discordapp.com/api/webhooks/0/MySecretWebhook',
    other: 'https://discordapp.com/api/webhooks/0/MySecretWebhook'
}

const etab = {
    name: 'Lycée XXX',
    id: '1234567X',
    publicurl: 'https://1234567X.index-education.net/pronote/'
}

// UTC to Current Time variation. Europe/Paris = 2 on Summer Time, 1 on Winter Time
const timediff = 2

module.exports = { url, username, password, webhook, etab, timediff };
