const pronote = require('pronote-api');
const credentials = require('./credentials.js');
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
    const evals = await session.evaluations();

    for (let eval of evals) {
        for (let e of eval.evaluations) {
            if (e.date > startdate && e.date < enddate) {
                if (e.levels == null) {
                    var levels = "Aucune compétence enregistrée."
                } else {
                    var levels = "Compétences :"
                    for (let comp of e.levels) {
                        levels = levels+`\n${comp.name} \`${comp.value.short}\``
                    }
                }
                webhook.evalResults(e.date, timeformat.toDateSnowflake(e.date), eval.name, eval.teacher, e.name, levels, eval.color)
                await sleep(2500)
            }
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