const pronote = require('pronote-api')
const credentials = require('./credentials.js')
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')
const storage = require('./storage.js')

async function main()
{
    await webhook.checkForUpdate()
    const session = await pronote.login(credentials.url, credentials.username, credentials.password, credentials.cas);
    const infos = await session.infos();

    for (let info of infos) {
        let title = info.title
        if (info.title === undefined) {
            title = "*Sans titre*"
        }
        let desc = info.content
        if (info.files != null) {
            for (let file of info.files) {
                desc = desc + `\n:link: [${file.name}](${file.url})`
            }
        }
        let check = {
            "date": info.date,
            "title": title,
            "author": info.author,
            "desc": info.content
        }
        if (storage.autoCheck("info", check) === false) {
            webhook.pronoteAnnouncement(info.date, timeformat.toDateSnowflake(info.date), title, info.author, desc)
            await sleep(2500)
        }
    }
}

main().catch(err => {
    if (err.code === pronote.errors.WRONG_CREDENTIALS.code) {
        console.error('Mauvais identifiants');
    } else {
        console.error(err);
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}