const pronote = require('pronote-api');
const config = require('./config.js').read()
const timediff = require('./config.js').timediff()
const webhook = require('./webhook.js')
const timeformat = require('./timeformat.js')

async function main()
{
    const session = await pronote.login(config['login']['url'], config['login']['username'], config['login']['password'], config['login']['cas']);
    const today = new Date()
    const startdate = new Date(today)
    startdate.setDate(startdate.getDate())
    startdate.setHours(23-timediff, 50, 0)
    const enddate = new Date(today)
    enddate.setDate(enddate.getDate() + 1)
    enddate.setHours(23-timediff, 50, 0)

    const timetable = await session.timetable(startdate, enddate)
    let containAnormalCourses = false
    if (config['courses']['compactCourses'] === false) {
        for (let course of timetable) {
            let room = course.room;
            if (course.room == null) {
                room = "inconnue"
            }
            if (course.isDetention === true) {
                webhook.detentionCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
                containAnormalCourses = true
                await sleep(2500)
            } else if (course.isCancelled === true) {
                webhook.cancelledCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
                containAnormalCourses = true
                await sleep(2500)
            } else if (course.isAway === true) {
                webhook.awayCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
                containAnormalCourses = true
                await sleep(2500)
            } else {
                if (config['courses']['hideNormalCourses'] === false) {
                    webhook.normalCourse(course.from, course.to, timeformat.toDateSnowflake(course.from), course.subject, course.teacher, room, course.color)
                    await sleep(2500)
                }
            }
        }
        if (config['courses']['hideNormalCourses'] === true) {
            let hours = 0
            for (let course of timetable) {
                let start = course.from
                let end = course.to
                hours =+ Math.abs(end - start) / 36e5;
            }
            if (containAnormalCourses === true) {
                webhook.containAnormalCourses(hours, timeformat.toDateSnowflake(timetable[0].from))
            } else {
                webhook.noAnormalCourses(hours, timeformat.toDateSnowflake(timetable[0].from))
            }
        }
    } else {
        let hours = 0
        for (let course of timetable) {
            let start = course.from
            let end = course.to
            hours += Math.abs(end - start) / 36e5;
        }
        let coursesMessage = []
        for (let course of timetable) {
            let courseTime = Math.abs(course.to - course.from) / 36e5;
            let room = course.room;
            if (course.room == null) {
                room = "salle inconnue"
            }
            if (course.isDetention) {coursesMessage.push(`:hammer: Colle en ${room} (${courseTime}H à ${timeformat.toHMString(course.from)})`); containAnormalCourses = true}
            else if (course.isCancelled) {coursesMessage.push(`:warning: **Cours modifié** ${course.teacher}: ${course.subject} en ${room} (${courseTime}H à ${timeformat.toHMString(course.from)})`); containAnormalCourses = true}
            else if (course.isAway) {coursesMessage.push(`:x: *Professeur absent* ~~${course.teacher}: ${course.subject} en ${room} (${courseTime}H à ${timeformat.toHMString(course.from)})~~`); containAnormalCourses = true}
            else {coursesMessage.push(`:white_check_mark: ${course.teacher}: ${course.subject} en ${room} (${courseTime}H à ${timeformat.toHMString(course.from)})`)}
        }
        if (containAnormalCourses === true) {
            webhook.anormalCompact(coursesMessage.join("\n"), hours, timeformat.toDateSnowflake(timetable[0].from))
        } else {
            webhook.normalCompact(coursesMessage.join("\n"), hours, timeformat.toDateSnowflake(timetable[0].from))
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