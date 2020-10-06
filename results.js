const pronote = require('pronote-api');
const credentials = require('./credentials.js');
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')
const storage = require('./storage.js')

async function main()
{
    const session = await pronote.login(credentials.url, credentials.username, credentials.password, credentials.cas);
    const evals = await session.evaluations();
    const marks = await session.marks();

    for (let eval of evals) {
        for (let e of eval.evaluations) {
            let ename = e.name;
            if (e.name === "") {
                ename = "*Sans titre*"
            }
            let levels;
            if (e.levels == null) {
                levels = "Aucune compétence enregistrée."
            } else {
                levels = "Compétences :"
                for (let comp of e.levels) {
                    levels = levels + `\n${comp.name} \`${comp.value.short}\``
                }
            }
            let check = {
                "date": e.date,
                "subject": eval.name,
                "name": ename,
                "levels": levels
            }
            if (storage.autoCheck("eval", check) === false) {
                webhook.evalResults(e.date, timeformat.toDateSnowflake(e.date), eval.name, eval.teacher, ename, levels, eval.color)
                await sleep(2500)
            }
        }
    }
    for (let subject of marks.subjects) {
        for (let mark of subject.marks) {
            let title = mark.title
            if (title === "") {
                title = "*Sans titre*"
            }
            let value = mark.value;
            if (mark.isAway === true) {
                value = "Absent"
            }
            let min = mark.min;
            if (mark.min === -1) {
                min = 0
            }
            let max = mark.max;
            if (mark.max === -1) {
                max = 0
            }
            let markDesc = `Note élève \`${value}\\${mark.scale}\` \nMoyenne classe \`${mark.average}\\${mark.scale}\` \nMinimum \`${min}\` Maximum \`${max}\` \nCoefficient \`${mark.coefficient}\``
            let avgDesc = `Moy.Gén. ${marks.averages.student} (Classe ${marks.averages.studentClass})`
            let check = {
                "date": mark.date,
                "subject": subject.name,
                "title": title,
                "mark": markDesc
            }
            if (storage.autoCheck("mark", check) === false) {
                webhook.markResults(mark.date, timeformat.toDateSnowflake(mark.date), subject.name, title, markDesc, avgDesc, subject.color)
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