const pronote = require('pronote-api');
const config = require('./config.js').read()
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')
const storage = require('./storage.js')

async function main()
{
    await webhook.checkForUpdate()
    const session = await pronote.login(config['login']['url'], config['login']['username'], config['login']['password'], config['login']['cas']);
    const evals = await session.evaluations();
    const marks = await session.marks();

    for (let eval of evals) {
        for (let e of eval.evaluations) {
            let ename = e.name;
            if (e.name === "") {
                ename = "*Sans titre*"
            }
            let levels;
            let storedlevels;
            if (e.levels == null) {
                levels = "Aucune compétence enregistrée."
                storedlevels = levels
            } else {
                levels = "Compétences :"
                storedlevels = levels
                for (let comp of e.levels) {
                    storedlevels = storedlevels + `\n${comp.name} \`${comp.value.short}\``
                    if (config['settings']['publicMode'] === true) {
                        levels = levels + `\n${comp.name}`
                    } else {
                        levels = levels + `\n${comp.name} \`${comp.value.short}\``
                    }
                }
            }
            let check = {
                "date": e.date,
                "subject": eval.name,
                "name": ename,
                "levels": storedlevels
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
            let storedmarkDesc = `Note élève \`${value}\\${mark.scale}\` \nMoyenne classe \`${mark.average}\\${mark.scale}\` \nMinimum \`${min}\` Maximum \`${max}\` \nCoefficient \`${mark.coefficient}\``
            let markDesc;
            if (config['settings']['publicMode'] === true) {
                markDesc = `Moyenne classe \`${mark.average}\\${mark.scale}\` \nMinimum \`${min}\` Maximum \`${max}\` \nCoefficient \`${mark.coefficient}\``
            } else {
                markDesc = `Note élève \`${value}\\${mark.scale}\` \nMoyenne classe \`${mark.average}\\${mark.scale}\` \nMinimum \`${min}\` Maximum \`${max}\` \nCoefficient \`${mark.coefficient}\``
            }
            let avgDesc;
            if (config['settings']['publicMode'] === true) {
                avgDesc = `Moy. Classe ${marks.averages.studentClass}`
            } else {
                avgDesc = `Moy.Gén. ${marks.averages.student} (Classe ${marks.averages.studentClass})`
            }
            let check = {
                "date": mark.date,
                "subject": subject.name,
                "title": title,
                "mark": storedmarkDesc
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