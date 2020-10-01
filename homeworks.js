const pronote = require('pronote-api')
const credentials = require('./credentials.js')
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')

async function main()
{
    const session = await pronote.login(credentials.url, credentials.username, credentials.password, credentials.cas);
    const today = new Date()
    const startdate = new Date(today)
    startdate.setDate(startdate.getDate())
    startdate.setHours(23-credentials.timediff, 50, 0)
    const enddate = new Date(today)
    enddate.setDate(enddate.getDate() + 1)
    enddate.setHours(23-credentials.timediff, 50, 0)
    const homeworks = await session.homeworks(startdate, enddate);

    for (let work of homeworks) {
        let desc = work.description;
        if (work.files != null) {
            for (let file of work.files) {
                desc = desc + `\n:link: [${file.name}](${file.url})`
            }
        }
        webhook.normalHomework(work.for, work.givenAt, timeformat.toDateSnowflake(work.for), timeformat.toFullString(work.givenAt), work.subject, desc, work.done, work.color)
        await sleep(2500)
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