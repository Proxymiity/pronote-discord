const pronote = require('pronote-api')
const credentials = require('./credentials.js')
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')

async function main()
{
    const session = await pronote.login(credentials.url, credentials.username, credentials.password);
    const today = new Date()
    const startdate = new Date(today)
    startdate.setDate(startdate.getDate() -1)
    startdate.setHours(23-credentials.timediff, 50, 0)
    const enddate = new Date(today)
    enddate.setDate(enddate.getDate())
    enddate.setHours(23-credentials.timediff, 50, 0)
    const infos = await session.infos();

    for (let info of infos) {
        if (info.date > startdate && info.date < enddate) {
            let desc = info.content
            if (info.files != null) {
                for (let file of info.files) {
                    desc = desc+`\n:link: [${file.name}](${file.url})`
                }
            }
            webhook.pronoteAnnouncement(info.date, timeformat.toDateSnowflake(info.date), info.title, info.author, desc)
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